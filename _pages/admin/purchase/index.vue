<template>
  <div>
    <purchase-modal v-model="show" :title="modalTitle" @create="getDataTable" :item="item" />
    <log-modal v-model="showError" :title="$tr('iaccounting.cms.title.viewLog')" :error="errorObj" />

    <crud
      ref="crudComponent"
      :crud-data="import('src/modules/qaccounting/_crud/purchases.vue')"
      :custom-data="customCrudData"
      :title="$route.meta.title"
    />
  </div>

</template>
<script>
import { defineComponent } from 'vue';
import controller from './controller';
import purchaseModal from "../../../_components/purchaseModal/index.vue";
import logModal from "../../../_components/logModal/index.vue";

export default defineComponent({
  props: {},
  components: {purchaseModal, logModal},
  setup() {
    return { ...controller() };
  }
});
</script>
<style lang="scss">
</style>
