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
        entityName: config("main.qaccounting.entityNames.accountingAccount"),
        apiRoute: 'apiRoutes.qaccounting.accountingAccounts',
        permission: 'iaccounting.accountingaccounts',
        create: {
          title: this.$tr('iaccounting.cms.title.newAccountingAccount'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', align: 'left'},
            {name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'rigth'},
            {
              name: 'parent', label: this.$tr('isite.cms.form.parent'), field: 'parent', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
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
          requestParams: {include: 'parent'},
        },
        update: {
          title: this.$tr('iaccounting.cms.title.updateAccountingAccount'),
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          name: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.name')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          externalId: {
            value: '',
            type: 'input',
            props: {
              label: this.$tr('isite.cms.form.externalId'),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          parentId: {
            value: 0,
            type: 'treeSelect',
            props: {
              label: this.$tr('isite.cms.form.parent'),
              options: [
                {label: this.$tr('isite.cms.label.disabled'), value: 0},
              ],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qaccounting.accountingAccounts',
              select: {label: 'name', id: 'id'},
              requestParams: {include: 'parent'}
            }
          },
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
