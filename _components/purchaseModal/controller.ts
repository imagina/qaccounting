import {computed, reactive, onMounted, toRefs, watch, ref} from "vue";
import service from './services'
//@ts-ignore
import {i18n, clone, alert} from 'src/plugins/utils'
import {getFieldsProvider} from "../../model";

export default function controller(props: any, emit: any) {
  // Refs
  const refs = {
    refForm: ref()
  }

  // States
  const state = reactive({
    show: false,
    formData: null,
    loading: false,
    n8nData: null,
    loadOptionsCrud: []
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
          action: () => refs.refForm.value.changeStep('next', true),
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
          colClass: 'col-12',
          type: 'media',
          props: {
            label: i18n.tr('iaccounting.cms.form.documentAnalysis'),
            zone: 'mainimage',
            entity: "Modules\\Iaccounting\\Entities\\Purchase",
            entityId: null
          }
        }
      }

      if (!!n8nData || existItem) {
        let fieldName = existItem ? 'providerId' : 'identification'
        fields = {
          identificationCopy: {
            type: 'copy',
            vIf: !existItem,
            props: {
              readonly: true,
              label: i18n.tr('iaccounting.cms.form.idNumberN8N')
            }
          }
        }

        fields[fieldName] = {
          type: 'crud',
          permission: 'iaccounting.providers.manage',
          props: {
            crudType: 'select',
            //@ts-ignore
            crudData: import('src/modules/qaccounting/_crud/providers.vue'),
            customData: {
              formLeft: getFieldsProvider(i18n.tr, {
                name: {value: n8nData?.provider?.name || ''},
                lastname: {value: n8nData?.provider?.lastname || ''},

                personKind: {value: n8nData?.provider?.personKind || 'company'},
                typeId: {value: n8nData?.provider?.typeId || 'NIT'},

                identification: {value: n8nData?.provider?.identification || ''},
                checkDigit: {value: n8nData?.provider?.checkDigit || ''},

                phoneNumber: {value: n8nData?.provider?.phoneNumber || ''},
                address: {value: n8nData?.provider?.address || ''},
              })
            },
            crudProps: {
              label: `${i18n.tr('isite.cms.label.provider')}*`,
              rules: [
                (val: any) => !!val || i18n.tr('isite.cms.message.fieldRequired')
              ],
              clearable: true,
              readonly: existItem
            },
            config: {
              filterByQuery: true,
              options: {
                label: 'name', value: existItem ? 'id' : 'identification',
              },
              loadedOptions: (val: any[]) => state.loadOptionsCrud = val
            },
          },
        }

        fields = {
          ...fields,

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
          paymentMethod: {
            value: '',
            type: 'input',
            required: true,
            props: {
              readonly: existItem,
              label: i18n.tr('isite.cms.label.paymentMethod') + '*'
            }
          },


          invoiceDate: {
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
          }
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
      if (data?.mediasSingle?.mainimage) {
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
            state.formData = {...response, identificationCopy: response?.identification}
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
      state.formData = null;
      state.loading = false;
      state.n8nData = null
    },
    setItem() {
      if (props.item) state.formData = props.item
    },
    callMethods() {
      if (!state.n8nData) methods.sendImage()
      else methods.createItem()
    }
  }

  // Mounted
  onMounted(() => {
  })

  watch(() => props.modelValue, (newValue) => {
    state.show = clone(newValue);
  })

  watch(() => state.loadOptionsCrud, (newValue) => {
    if (!!props.item?.id) return

    const identification = state.formData?.identification

    const provider = newValue.find(p => p.identification == identification)

    if (provider) state.n8nData = {...state.n8nData || {}, providerId: provider.id}
  })

  watch(() => state.show, (newValue) => {
    emit('update:modelValue', newValue)
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
