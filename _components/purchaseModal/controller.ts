import {computed, reactive, onMounted, toRefs, watch, ref} from "vue";
import service from './services'
//@ts-ignore
import {i18n, clone, alert} from 'src/plugins/utils'

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
    loadOptionsCrud: [],
    file: null,
    extensionDocs: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pps']
  })

  // Computed
  const computeds = {
    modalProps: computed(() => {
      //Validate params props
      if (!state.show) return {}

      const existn8nData = !!state.n8nData
      const existItem = !!props.item?.id

      const title = existn8nData ? i18n.tr('iaccounting.cms.title.verifyDocument') : props.title

      const actions: any = [
        {
          action: () => methods.closeModal(),
          props: {
            color: 'grey-5',
            textColor: 'grey-8',
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
        modalWidthSize: !!state.file && existn8nData ? '90vw' : '65vw',
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
        banner: {
          type: 'banner',
          colClass: 'col-12',
          vIf: (!!n8nData && !state.formData?.identification) && !existItem,
          props: {
            color: 'info',
            icon: 'fas fa-exclamation-triangle',
            message: i18n.tr('iaccounting.cms.messages.providerDesc'),
          }
        }
      }
      const validations = !!n8nData || existItem;
      let fieldName = existItem ? 'providerId' : 'identification'

      fields[fieldName] = {
        type: 'crud',
        permission: 'iaccounting.providers.manage',
        colClass: 'col-12',
        vIf: validations,
        props: {
          crudType: 'select',
          //@ts-ignore
          crudData: import('src/modules/qaccounting/_crud/providers.vue'),
          customData: {
            create: {
              dataCustom: {
                name: n8nData?.provider?.name || '',
                lastname: n8nData?.provider?.lastname || '',
                personKind: n8nData?.provider?.personKind || 0,
                typeId: n8nData?.provider?.typeId || 0,
                identification: n8nData?.provider?.identification || '',
                checkDigit: n8nData?.provider?.checkDigit || '',
                phoneNumber: n8nData?.provider?.phoneNumber || '',
                address: n8nData?.provider?.address || '',
              }
            },
            formLeft: {
              banner: {
                type: 'banner',
                colClass: 'col-12',
                props: {
                  vIf: true,
                  color: 'info',
                  icon: 'fas fa-exclamation-triangle',
                  message: i18n.tr('iaccounting.cms.messages.providerCreateDesc'),
                }
              }
            },
            formRight: {
              viewFile: {
                type: 'previewFile',
                props: {
                  imgProps: {
                    height: "calc(100vh - 200px)",
                  },
                  url: state.file?.url,
                  extension: state.file?.extension
                }
              }
            },
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
          value: 0,
          type: 'select',
          required: true,
          vIf: validations,
          props: {
            label: `${i18n.tr('iaccounting.cms.form.documentType')}*`,
            readonly: existItem
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qaccounting.documentTypes',
          }
        },
        paymentMethodId: {
          value: 0,
          type: 'select',
          required: true,
          vIf: validations,
          props: {
            label: `${i18n.tr('isite.cms.label.paymentMethod')}*`,
            readonly: existItem
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qaccounting.paymentMethods',
          }
        },


        invoiceDate: {
          value: null,
          type: 'date',
          vIf: validations,
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
          vIf: validations,
          props: {
            label: i18n.tr('iaccounting.cms.form.currencyCode'),
            readonly: existItem,
          }
        },

        totalTax: {
          value: 0,
          type: 'input',
          fakeFieldName: 'options',
          vIf: validations,
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
          vIf: validations,
          props: {
            type: 'number',
            label: i18n.tr('iaccounting.cms.form.discount'),
            readonly: existItem,
          }
        },

        subtotal: {
          value: 0,
          type: 'input',
          vIf: validations,
          props: {
            type: 'number',
            label: i18n.tr('iaccounting.cms.form.subtotal'),
            readonly: existItem,
          }
        },
        total: {
          value: 0,
          type: 'input',
          vIf: validations,
          props: {
            type: 'number',
            label: i18n.tr('iaccounting.cms.form.total'),
            readonly: existItem,
          }
        },

        mediasSingle: {
          name: 'mediasSingle',
          value: {},
          required: true,
          colClass: 'col-12',
          type: 'media',
          vIf: !existItem,
          props: {
            label: i18n.tr('iaccounting.cms.form.documentAnalysis'),
            zone: 'mainimage',
            entity: "Modules\\Iaccounting\\Entities\\Purchase",
            entityId: null,
            readonly: existItem
          },
          getFiles: (item: any) => {
            const file = item[0] || null
            if (!file) return

            if (state.extensionDocs.includes(file.extension)) file.url = `https://view.officeapps.live.com/op/view.aspx?src=${file.url}`

            state.file = file
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
      const file: any = state.file
      if (file?.url) {
        state.loading = true

        //Create purchase support
        await service.sendN8NImg({attributes: file}).then((response: any) => {
          state.n8nData = response
          state.formData = response
        }).catch(() => {
          alert.error({message: i18n.tr('isite.cms.message.errorRequest')});
        })

        state.loading = false
      }
    },
    //Update block
    createItem: () => {
      if (state.formData) {
        const provider = state.loadOptionsCrud.find(p => p.identification == state.formData.identification)

        const dataToCreate = {
          ...state.n8nData,
          providerId: provider?.id,
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

  watch(() => state.show, (newValue) => {
    emit('update:modelValue', newValue)
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
