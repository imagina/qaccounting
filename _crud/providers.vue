<template>
</template>
<script>
import {getFieldsProvider} from "../model";

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
            {name: 'type_id', label: this.$tr('iaccounting.cms.form.idType'), field: 'typeId', align: 'rigth'},
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
        formLeft: getFieldsProvider(this.$tr)
      }
    }
  },
  //Crud info
  crudInfo() {
    return this.$store.state.qcrudComponent.component[this.crudId] || {}
  }
}
</script>
