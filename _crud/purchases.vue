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
        entityName: config("main.qaccounting.entityNames.purchase"),
        apiRoute: 'apiRoutes.qaccounting.purchases',
        permission: 'iaccounting.purchases',
        create: {},
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left'},
            {
              name: 'provider_id',
              label: this.$tr('iaccounting.cms.form.providerName'),
              field: 'provider',
              format: val => val?.name || '-',
              align: 'left',
              action: 'edit'
            },
            {
              name: 'payment_method',
              label: this.$tr('isite.cms.label.paymentMethod'),
              field: 'paymentMethod',
              align: 'left'
            },
            {name: 'subtotal', label: this.$tr('iaccounting.cms.form.subtotal'), field: 'subtotal', align: 'left'},
            {name: 'total', label: this.$tr('iaccounting.cms.form.total'), field: 'total', align: 'rigth'},
            {
              name: 'elaboration_date',
              label: this.$tr('iaccounting.cms.form.elaborationDate'),
              field: 'elaborationDate',
              align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {
            include: 'provider'
          }
        },
        update: {},
        delete: true,
        formLeft: {}
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  }
}
</script>
