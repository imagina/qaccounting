import {computed, reactive, onMounted, toRefs, watch, ref} from "vue";
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
      const existItem = !!props.item?.id

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

      if (!existItem) {
        actions.push({
          action: () => existn8nData ? refs.refForm.value.changeStep('next', true) : methods.sendImage(),
          props: {
            color: 'primary',
            label: i18n.tr(existn8nData ? 'isite.cms.label.save' : 'isite.cms.message.uploadFile'),
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

      const n8nData = state.n8nData
      const existItem = !!props.item?.id

      let description = '';

      if (!existItem) {
        description = !!n8nData ? i18n.tr('iaccounting.cms.messages.descriptionValidate') : i18n.tr('iaccounting.cms.messages.descriptionAnalyze')
      }

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

      if (!!n8nData || existItem || true) {
        fields = {
          providerIdNumber: {
            value: '',
            type: 'input',
            fakeFieldName: 'options',
            props: {
              label: `${i18n.tr('iaccounting.cms.form.providerIdNumber')}*`,
              readonly: true,
              rules: [
                (val: any) => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          providerId: {
            type: 'crud',
            permission: 'iaccounting.providers.manage',
            props: {
              readonly: existItem,
              crudType: 'select',
              //@ts-ignore
              crudData: import('src/modules/qaccounting/_crud/providers.vue'),
              crudProps: {
                label: `${i18n.tr('isite.cms.label.provider')}*`,
                rules: [
                  (val: any) => !!val || i18n.tr('isite.cms.message.fieldRequired')
                ],
              },
              config: {
                options: {
                  label: 'name', value: 'id'
                },
                loadedOptions: (items) => console.warn("ITEMS: ",{items})
              }
            },
          },

          documentType: {
            value: 'electronicInvoice',
            type: 'select',
            props: {
              label: `${i18n.tr('iaccounting.cms.form.documentType')}*`,
              options: [
                {label: i18n.tr('iaccounting.cms.label.documentSupport'), value: 'supportDocument'},
                {label: i18n.tr('iaccounting.cms.label.electronicInvoice'), value: 'electronicInvoice'}
              ],
              readonly: existItem,
              rules: [
                (val: any) => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ]
            }
          },


          elaborationDate: {
            value: null,
            type: 'date',
            props: {
              label: i18n.tr('iaccounting.cms.form.elaborationDate') + '*',
              readonly: existItem,
              rules: [
                (val: any) => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          currencyCode: {
            value: 'COP',
            type: 'input',
            props: {
              label: i18n.tr('iaccounting.cms.form.currencyCode'),
              readonly: existItem,
            }
          },

          totalTax: {
            value: 0,
            type: 'input',
            fakeFieldName: 'options',
            props: {
              type: 'number',
              label: i18n.tr('iaccounting.cms.form.totalTax'),
              readonly: existItem,
            }
          },
          discount: {
            value: 0,
            type: 'input',
            fakeFieldName: 'options',
            props: {
              type: 'number',
              label: i18n.tr('iaccounting.cms.form.discount'),
              readonly: existItem,
            }
          },

          subtotal: {
            value: 0,
            type: 'input',
            props: {
              type: 'number',
              label: i18n.tr('iaccounting.cms.form.subtotal'),
              readonly: existItem,
            }
          },
          total: {
            value: 0,
            type: 'input',
            props: {
              type: 'number',
              label: i18n.tr('iaccounting.cms.form.total'),
              readonly: existItem,
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
          }, 0)
        }).catch(() => {
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
        service.createItem(dataToCreate).then(() => {
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
    },
    setItem() {
      if (props.item) state.formData = props.item
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
