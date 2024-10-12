<template>
</template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  components: {},
  computed: {
    crudData() {
      const crudInfo = this.crudInfo;
      const isPerson = crudInfo?.personKind == 0;
      return {
        crudId: this.crudId,
        entityName: config("main.qaccounting.entityNames.provider"),
        apiRoute: 'apiRoutes.qaccounting.providers',
        permission: 'iaccounting.providers',
        create: {
          title: this.$tr('iaccounting.cms.title.newProvider'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left'},
            {name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'rigth'},
            {
              name: 'type_id', label: this.$tr('iaccounting.cms.form.idType'), field: 'typeName', align: 'rigth',
              format: val => val?.title ?? '-'
            },
            {
              name: 'identification',
              label: this.$tr('iaccounting.cms.form.idNumber'),
              field: 'identification',
              align: 'rigth'
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ]
        },
        update: {
          title: this.$tr('iaccounting.cms.title.updateProvider'),
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          banner: {
            type: 'banner',
            props: {
              vIf: false
            }
          },

          name: {
            value: '',
            type: 'input',
            required: true,
            colClass: `col-12 ${isPerson ? 'col-md-6' : ''}`,
            props: {
              label: `${this.$tr(isPerson ? 'isite.cms.form.name' : 'iaccounting.cms.label.companyName')}*`
            },
          },
          lastname: {
            value: '',
            type: 'input',
            colClass: isPerson ? 'col-12 col-md-6' : '',
            props: {
              vIf: isPerson,
              label: this.$tr('isite.cms.form.lastName'),
            },
          },

          personKind: {
            value: 1,
            type: 'select',
            required: true,
            colClass: 'col-12 col-md-6',
            props: {
              label: this.$tr('iaccounting.cms.form.kindPerson') + '*'
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qaccounting.kindPeople',
            }
          },
          typeId: {
            value: 0,
            type: 'select',
            required: true,
            colClass: 'col-12 col-md-6',
            props: {
              label: this.$tr('iaccounting.cms.form.idType') + '*'
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qaccounting.documentTypePeople',
            }
          },

          identification: {
            value: '',
            type: 'input',
            required: true,
            colClass: 'col-10 col-md-4',
            props: {
              label: this.$tr('iaccounting.cms.form.idNumber') + '*'
            }
          },
          checkDigit: {
            value: '',
            type: 'input',
            colClass: 'col-2',
            props: {
              label: this.$tr('iaccounting.cms.form.checkDigit')
            }
          },
          cityId: {
            value: null,
            type: 'select',
            colClass: 'col-12 col-md-6',
            required: true,
            props: {
              label: this.$tr('isite.cms.form.city') + '*'
            },
            loadOptions: {
              filterByQuery: true,
              apiRoute: 'apiRoutes.qlocations.cities',
              select: {label: 'name', id: 'id'}
            }
          },

          phoneNumber: {
            type: 'input',
            colClass: "col-12 col-md-6",
            props: {
              label: this.$tr('isite.cms.label.phoneNumber')
            },
          },
          externalId: {
            value: '',
            type: 'input',
            colClass: 'col-12 col-md-6',
            props: {
              label: this.$tr('isite.cms.form.externalId'),
            }
          },

          address: {
            value: '',
            type: 'input',
            colClass: 'col-12',
            props: {
              label: this.$tr('isite.cms.form.address')
            }
          }
        },
        handleFormUpdates: (formData, changedFields, formType) => {
          return new Promise(resolve => {
            if (changedFields.length === 1) {
              if (changedFields.includes('identification')) {
                formData.checkDigit = this.calculateDV(formData.identification);
              } else if (changedFields.includes('personKind')) formData.typeId = isPerson ? 0 : 1
            }
            resolve(formData)
          })
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    calculateDV(nit) {
      const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47];
      let nitStr = String(nit).split('').reverse(); // Reverse the NIT to apply the weights from right to left
      let sum = nitStr.reduce((acc, digit, i) => acc + parseInt(digit) * weights[i], 0);

      let remainder = sum % 11;
      if (remainder === 0 || remainder === 1) {
        return 0;
      } else {
        return 11 - remainder;
      }
    }
  }
}
</script>
