import {computed, reactive, onMounted, toRefs, watch} from "vue";
import service from './services'
import {i18n, clone, alert} from 'src/plugins/utils'

export default function controller(props: any, emit: any) {
  // Refs
  const refs = {}

  // States
  const state = reactive({
    show: false,
    formData: {},
    loading: false
  })

  // Computed
  const computeds = {
    modalProps: computed(() => {
      //Validate params props
      if (!state.show) return {}

      //Response
      return {
        title: props.title,
        width: 'max-content',
        loading: state.loading,
        actions: []
      }
    }),
    dynamicForm: computed(() =>{
      //Instace response
      let response = {
        actions: {
          submit: {
            label: i18n.tr('iprofile.cms.label.save'),
            color: 'primary',
            icon: null
          },
          next: {
            label: i18n.tr('iprofile.cms.label.save'),
            color: 'primary',
            icon: null
          }
        },
        blocks: [
          {
            //title: 'Main Block',
            name: 'main',
            fields: {
              email: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$tr('isite.cms.form.email')}*`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
                  ]
                }
              },
              password: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$tr('isite.cms.form.password')}*`,
                  type: 'password',
                  vIf: this.form.changePassword,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => val.length >= 6 || this.$tr('isite.cms.message.fieldMinLeng', {num: 6})
                  ]
                }
              },
              passwordConfirmation: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$tr('isite.cms.form.checkPassword')}*`,
                  type: 'password',
                  vIf: this.form.changePassword,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => (this.form['main-password'] == val) || this.$tr('isite.cms.message.fieldCheckPassword'),
                  ]
                }
              },
              ...(this.termsAndConditions ? {terms: this.termsAndConditions} : {})
            }
          },
          ...this.$clone(this.extraBlocks)
        ]
      }

      //Add blocks to auth roles
      if (this.authRoles && (this.authRoles.length >= 2)) {
        response.blocks.unshift({
          //title: 'Role Block',
          name: 'role',
          fields: {
            roleId: {
              value: null,
              type: 'optionGroup',
              colClass: 'col-12',
              props: {
                options: this.authRoles.map(item => {
                  return {label: `${this.$tr('iprofile.cms.label.registerAs')} ${item.name}`, value: item.id}
                }),
                color: 'secondary',
                rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')]
              }
            }
          }
        })
      }

      //concat block name to fields
      response.blocks.forEach((block, blockKey) => {
        let fields = {}
        Object.keys(block.fields).forEach(fieldKey =>
          fields[`${block.name}-${fieldKey}`] = {...block.fields[fieldKey], name: `${block.name}-${fieldKey}`}
        )
        response.blocks[blockKey].fields = fields
      })

      //Response
      return response
    }),
    fields: computed(() => {
      //Validate params props
      if (!state.show) return []

      //Response
      return [
        {
          name: 'main',
          title: "Sube tu documento",
          description: "Puedes subir imagenes, pdf, docx, etc",
          fields: {
            mediasSingle: {
              name: 'mediasSingle',
              value: {},
              type: 'media',
              props: {
                label: i18n.tr('isite.cms.form.firstImage'),
                zone: 'mainimage',
                entity: "Modules\\Iaccounting\\Entities\\Purchase",
                entityId: null
              }
            },
          }
        },
        {
          name: 'purchase',
          title: "Corrobora la informacion",
          description: "Asegurate que la información proporcionada es la correcta",
          fields: {
            mediasSingle: {
              name: 'mediasSingle',
              value: {},
              type: 'media',
              props: {
                label: i18n.tr('isite.cms.form.firstImage'),
                zone: 'mainimage',
                entity: "Modules\\Iaccounting\\Entities\\Purchase",
                entityId: null
              }
            },
          }
        }
      ]
    })
  }

  // Methods
  const methods = {
    //Update block
    createItem: () => {
      if (state.formData) {
        state.loading = true

        //Create purchase support
        service.createItem(state.formData).then(response => {
          alert.info({message: i18n.tr('isite.cms.message.recordCreated')});
          //Emit info to Editor and Close Modal
          emit('create')
          methods.closeModal()
        }).catch(() => {
          alert.error({message: i18n.tr('isite.cms.message.recordNoCreated')});
          state.loading = false
        })
      }
    },
    closeModal() {
      state.show = false
      state.formData = {};
      state.loading = false;
      state.fields = []
    },
  }

  // Mounted
  onMounted(() => {
  })

  watch(() => props.modelValue, (newValue) => {
    state.show = clone(newValue);
  })

  watch(() => state.show, (newValue) => {
    emit('input', newValue)
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
