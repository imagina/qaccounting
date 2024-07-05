import {computed, reactive, onMounted, toRefs, watch, onUnmounted, ref} from "vue";
import service from './services'
import {i18n, clone, alert} from 'src/plugins/utils'

export default function controller(props: any, emit: any) {
  // Refs
  const refs = {
    refForm: ref()
  }

  // States
  const state = reactive({
    show: false,
    formData: {},
    loading: false,
    n8nData: null
  })

  // Computed
  const computeds = {
    modalProps: computed(() => {
      //Validate params props
      if (!state.show) return {}

      const existn8nData = !!state.n8nData

      const title = existn8nData ? i18n.tr('iaccounting.cms.title.verifyDocument') : props.title

      const actions = [
        {
          action: () => methods.closeModal(),
          props: {
            color: 'grey-5',
            label: i18n.tr('isite.cms.label.cancel'),
          }
        }
      ]

      if (existn8nData) {
        actions.push({
          action: () => refs.refForm.value.changeStep('next', true),
          props: {
            color: 'primary',
            label: i18n.tr('isite.cms.label.save'),
          }
        })
      } else {
        actions.push({
          action: () => methods.sendImage(),
          props: {
            color: 'primary',
            label: i18n.tr('isite.cms.message.uploadFile'),
          }
        })
      }

      //Response
      return {
        title,
        width: 'max-content',
        persistent: true,
        loading: state.loading,
        actions
      }
    }),
    fields: computed(() => {
      //Validate params props
      if (!state.show) return []

      const existn8nData = !!state.n8nData

      let description = existn8nData ? i18n.tr('iaccounting.cms.messages.descriptionValidate') : i18n.tr('iaccounting.cms.messages.descriptionAnalyze')

      let fields: any = {
        mediasSingle: {
          name: 'mediasSingle',
          value: {},
          required: true,
          type: 'media',
          props: {
            label: i18n.tr('iaccounting.cms.form.documentAnalysis'),
            zone: 'mainimage',
            entity: "Modules\\Iaccounting\\Entities\\Purchase",
            entityId: null
          }
        }
      }

      if (existn8nData) {
        fields = {
          documentType: {
            value: 'supportDocument',
            type: 'select',
            props: {
              label: `${i18n.tr('iaccounting.cms.form.documentType')}*`,
              options: [
                {label: i18n.tr('iaccounting.cms.label.documentSupport'), value: 'supportDocument'},
                {label: i18n.tr('iaccounting.cms.label.electronicInvoice'), value: 'electronicInvoice'}
              ],
              rules: [
                val => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          providerName: {
            value: '',
            type: 'input',
            props: {
              label: `${i18n.tr('iaccounting.cms.form.providerName')}*`,
              rules: [
                val => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ]
            }
          },

          providerIdType: {
            value: 'NIT',
            type: 'select',
            props: {
              label: `${i18n.tr('iaccounting.cms.form.providerIdType')}*`,
              options: [
                {label: 'Cedula de Ciudadania', value: 'CC'},
                {label: 'Número de Identificación Tributaria (NIT)', value: 'NIT'}
              ],
              rules: [
                val => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          providerIdNumber: {
            value: '',
            type: 'input',
            props: {
              label: `${i18n.tr('iaccounting.cms.form.providerIdNumber')}*`,
              rules: [
                val => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ]
            }
          },

          elaborationDate: {
            value: null,
            type: 'date',
            props: {
              label: i18n.tr('iaccounting.cms.form.elaborationDate') + '*',
              rules: [
                val => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          currencyCode: {
            value: 'COP',
            type: 'input',
            props: {
              label: i18n.tr('iaccounting.cms.form.currencyCode')
            }
          },

          totalTax: {
            value: 0,
            type: 'input',
            props: {
              type: 'number',
              label: i18n.tr('iaccounting.cms.form.totalTax')
            }
          },
          discount: {
            value: 0,
            type: 'input',
            fakeFieldName: 'options',
            props: {
              type: 'number',
              label: i18n.tr('iaccounting.cms.form.discount')
            }
          },

          subtotal: {
            value: 0,
            type: 'input',
            props: {
              type: 'number',
              label: i18n.tr('iaccounting.cms.form.subtotal')
            }
          },
          total: {
            value: 0,
            type: 'input',
            props: {
              type: 'number',
              label: i18n.tr('iaccounting.cms.form.total')
            }
          },
        }
      }
      //Response
      return [{description, fields}]
    })
  }

  // Methods
  const methods = {
    sendImage: async () => {
      const data: any = state.formData
      if (data?.mediasSingle?.mainimage || true) {
        state.loading = true

        const attributes = {
          imageId: data?.mediasSingle?.mainimage
        }

        //Create purchase support
        await service.sendN8NImg({attributes}).then((response: any) => {
          state.n8nData = {
            ...data,
            ...response
          }

          setTimeout(() => {
            state.formData = response
          },0)
        }).catch((error) => {
          alert.error({message: i18n.tr('isite.cms.message.errorRequest')});
        })

        state.loading = false
      }
    },
    //Update block
    createItem: () => {
      if (state.formData) {
        const dataToCreate = {
          ...state.n8nData,
          ...state.formData
        }

        state.loading = true

        //Create purchase support
        service.createItem(dataToCreate).then(response => {
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
      state.n8nData = null
    }
  }

  // Mounted
  onMounted(() => {
  })

  watch(() => props.modelValue, (newValue) => {
    state.show = clone(newValue);
  })

  watch(() => state.show, (newValue) => {
    emit('update:modelValue', newValue)
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
