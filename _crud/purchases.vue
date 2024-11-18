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
              name: 'statusName',
              label: this.$tr('isite.cms.form.status'),
              field: 'statusName',
              format: item => this.getTag(item),
              align: 'left'
            },
            {
              name: 'payment_method',
              label: this.$tr('isite.cms.label.paymentMethod'),
              field: 'paymentName',
              format: val => val?.title ?? '-',
              align: 'left'
            },
            {name: 'subtotal', label: this.$tr('iaccounting.cms.form.subtotal'), field: 'subtotal', align: 'left'},
            {name: 'total', label: this.$tr('iaccounting.cms.form.total'), field: 'total', align: 'rigth'},
            {
              name: 'invoice_date',
              label: this.$tr('iaccounting.cms.form.elaborationDate'),
              field: 'invoiceDate',
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
            include: 'provider,files',
            filter: {createdBy: this.$store.state.quserAuth.userId}
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
  },
  methods: {
    getTag(item) {
      const title = item?.title;
      if (!title) return '-';
      const bg = item.bg || '#E8EBEE'
      const color = item.color || '#496D8B'

      // <i className="fa-solid fa-comment-dots"></i>
      return `<span class="tw-border tw-py-0.5 tw-px-2 tw-rounded-md tw-font-bold" style="background-color: ${bg}; color: ${color}; font-size: 10px;">${title}</span>`;
    },
  }
}
</script>
