<template>
</template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
    }
  },
  components: {},
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qaccounting.entityNames.mapping"),
        apiRoute: 'apiRoutes.qaccounting.mappings',
        permission: 'iaccounting.mappings',
        create: {
          title: this.$tr('iaccounting.cms.title.newMappings'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left'},
            {name: 'type', label: this.$tr('isite.cms.form.type'), field: 'type', align: 'rigth'},
            {
              name: 'apikey_id',
              label: this.$tr('iaccounting.cms.form.apiKey'),
              field: 'apikey',
              align: 'rigth',
              format: (val) => val?.name ?? '-'
            },
            {name: 'external_id', label: this.$tr('isite.cms.form.externalId'), field: 'externalId', align: 'left'},
            {
              name: 'external_name',
              label: this.$tr('iaccounting.cms.label.externalName'),
              field: 'externalName',
              align: 'left'
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
          ],
          requestParams: {include: 'apikey'},
        },
        update: {
          title: this.$tr('iaccounting.cms.title.updateMapping'),
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          type: {
            value: null,
            type: 'select',
            required: true,
            props: {
              label: `${this.$tr('isite.cms.form.type')}*`,
              options: [
                {label: this.$tr('iaccounting.cms.sidebar.adminAccountingaccounts'), value: 'iaccounting.cms.sidebar.adminAccountingaccounts'},
                {label: this.$tr('isite.cms.label.paymentMethod'), value: 'isite.cms.label.paymentMethod'}
              ]
            }
          },
          apikeyId: {
            value: null,
            type: 'select',
            required: true,
            props: {
              label: `${this.$tr('iaccounting.cms.form.apiKey')}*`
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qaccounting.apikeys',
              select: {label: 'name', id: 'id'}
            }
          },
          externalId: {
            value: '',
            type: 'input',
            required: true,
            props: {
              label: this.$tr('isite.cms.form.externalId'),
            }
          },
          externalName: {
            value: '',
            type: 'input',
            required: true,
            props: {
              label: `${this.$tr('iaccounting.cms.label.externalName')}*`
            },
          }
        },
      }
    }
  },
  //Crud info
  crudInfo() {
    return this.$store.state.qcrudComponent.component[this.crudId] || {}
  }
}
</script>
