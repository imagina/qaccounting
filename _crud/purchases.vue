<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qaccounting.entityNames.purchase"),
        apiRoute: 'apiRoutes.qaccounting.purchases',
        permission: 'iaccounting.purchases',
        create: {
          title: this.$tr('iaccounting.cms.title.newPurchase'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left'},
            {
              name: 'user_id',
              label: this.$tr('isite.cms.form.provider(PT)'),
              field: 'user',
              align: 'rigth',
              format: (u) => u?.firstName || '-'
            },
            {
              name: 'payment_method',
              label: this.$tr('isite.cms.form.paymentMethod(PT)'),
              field: 'paymentMethod',
              align: 'left'
            },
            {name: 'subtotal', label: this.$tr('isite.cms.form.subtotal(PT)'), field: 'subtotal', align: 'left'},
            {name: 'total', label: this.$tr('isite.cms.form.total(PT)'), field: 'total', align: 'rigth'},
            {
              name: 'elaboration_date',
              label: this.$tr('isite.cms.form.elaborationDate(PT)'),
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
        },
        update: false,
        delete: true,
        formLeft: {}
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
