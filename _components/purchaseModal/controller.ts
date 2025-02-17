import {computed, reactive, onMounted, toRefs, watch, ref} from "vue";
import service from './services'
import {calculateDV} from '../../helper'
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
      } else if (props.item?.statusId == 2) {
        actions.push({
          action: () => refs.refForm.value.changeStep('next', true),
          props: {
            color: 'primary',
            label: i18n.tr('iaccounting.cms.button.retry'),
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
      const readOnlyField = !!existItem && props.item?.statusId != 2;

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
                checkDigit: calculateDV(n8nData?.provider?.identification || ''),
                phoneNumber: n8nData?.provider?.phoneNumber || '',
                address: n8nData?.provider?.address || '',
                email: n8nData?.provider?.email || '',
                cityId: n8nData?.provider?.cityId || null,
                cityCode: n8nData?.provider?.cityCode || ''
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
            readonly: readOnlyField
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
          /*type: 'select',
          required: true,
          vIf: validations,
          props: {
            label: `${i18n.tr('iaccounting.cms.form.documentType')}*`,
            readonly: readOnlyField
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qaccounting.documentTypes',
          }*/
        },
        paymentMethodId: {
          value: 0,
          /*type: 'select',
          required: true,
          vIf: validations,
          props: {
            label: `${i18n.tr('isite.cms.label.paymentMethod')}*`,
            readonly: readOnlyField
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qaccounting.paymentMethods',
          }*/
        },


        invoiceDate: {
          value: null,
          type: 'date',
          vIf: validations,
          props: {
            mask: readOnlyField ? 'YYYY/MM/DD' : 'YYYY-MM-DD',
            label: i18n.tr('iaccounting.cms.form.elaborationDate') + '*',
            readonly: readOnlyField,
            rules: [
              (val: any) => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ]
          }
        },
        currencyCode: {
          value: 'COP',
          colClass: 'hidden',
          /*type: 'input',
          vIf: validations,
          props: {
            label: i18n.tr('iaccounting.cms.form.currencyCode'),
            readonly: readOnlyField,
          }*/
        },

        totalTax: {
          value: 0,
          type: 'input',
          fakeFieldName: 'options',
          vIf: validations,
          props: {
            type: 'number',
            label: i18n.tr('iaccounting.cms.form.totalTax'),
            readonly: readOnlyField,
          }
        },
        /*discount: {
          value: 0,
          type: 'input',
          fakeFieldName: 'options',
          vIf: validations,
          props: {
            type: 'number',
            label: i18n.tr('iaccounting.cms.form.discount'),
            readonly: readOnlyField,
          }
        },*/

        subtotal: {
          value: 0,
          type: 'input',
          vIf: validations,
          props: {
            type: 'number',
            label: i18n.tr('iaccounting.cms.form.subtotal'),
            readonly: readOnlyField,
          }
        },
        total: {
          value: 0,
          type: 'input',
          vIf: validations,
          props: {
            type: 'number',
            label: i18n.tr('iaccounting.cms.form.total'),
            readonly: readOnlyField,
          }
        },

        invoiceItems: {
          value: [],
          type: 'multiplier',
          vIf: validations,
          colClass: "col-12",
          props: {
            label: 'Products',
            isDraggable: false, // Default true
            maxQuantity: 15, // Default 5
            fields: {
              type: {
                value: 'Account',
                colClass: 'hidden',
                /*type: 'select',
                colClass: "col-6",
                props: {
                  label: i18n.tr('isite.cms.form.type'),
                  readonly: readOnlyField,
                  options: [
                    {label: i18n.tr('iaccounting.cms.label.account'), value: 'Account'}
                  ]
                },*/
              },
              code: {
                value: null,
                type: 'input',
                colClass: "col-6",
                required: true,
                props: {
                  readonly: readOnlyField,
                  label: i18n.tr('isite.cms.label.code')
                }
              },
              quantity: {
                value: 0,
                type: 'input',
                colClass: "col-6",
                props: {
                  type: 'number',
                  readonly: readOnlyField,
                  label: i18n.tr('isite.cms.label.quantity')
                }
              },
              description: {
                value: null,
                type: 'input',
                colClass: "col-12 col-md-6",
                props: {
                  readonly: readOnlyField,
                  label: i18n.tr('isite.cms.label.description')
                }
              },
              iva: {
                value: null,
                type: 'input',
                colClass: "col-6 col-md-3",
                props: {
                  type: 'number',
                  readonly: readOnlyField,
                  label: i18n.tr('iaccounting.cms.label.taxPercentage')
                }
              },
              price: {
                value: 0,
                type: 'input',
                colClass: "col-6 col-md-3",
                props: {
                  type: 'number',
                  readonly: readOnlyField,
                  label: i18n.tr('isite.cms.label.price')
                }
              },
            }
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
            methods.setImage(file);
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
    updateItem: () => {
      const data = state.formData
      if (data) {
        state.loading = true
        //Update purchase
        service.updateItem(props.item.id, data).then(() => {
          alert.info({message: i18n.tr('isite.cms.message.recordUpdated')});
          //Emit info to Editor and Close Modal
          emit('create')
          methods.closeModal()
        }).catch(() => {
          alert.error({message: i18n.tr('isite.cms.message.recordNoUpdated')});
          state.loading = false
        })
      }
    },
    closeModal() {
      state.show = false
      state.formData = null;
      state.loading = false;
      state.n8nData = null;
      state.file = null;
    },
    setItem() {
      if (props.item) {
        state.formData = props.item
        if(props.item?.statusId == 2) methods.setImage(props.item.mediaFiles.mainimage);
      }
    },
    callMethods() {
      if (props.item) methods.updateItem()
      else if (!state.n8nData) methods.sendImage()
      else methods.createItem()
    },
    setImage(file = null) {
      if (!file) return
      if (state.extensionDocs.includes(file.extension)) file.url = `https://view.officeapps.live.com/op/view.aspx?src=${file.url}`
      state.file = file
    }
  }

  // Mounted
  onMounted(() => {
  })

  watch(() => props.modelValue, (newValue) => {
    state.show = clone(newValue);
    if(newValue) {
      methods.setItem()
    }
  })

  watch(() => state.show, (newValue) => {
    emit('update:modelValue', newValue)
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
