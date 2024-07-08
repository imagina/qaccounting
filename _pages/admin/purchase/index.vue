<template>
  <div>
    <purchase-modal v-model="show" :title="modalTitle" @create="getDataTable" :item="item" />

    <crud
      ref="crudComponent"
      :crud-data="import('src/modules/qaccounting/_crud/purchases.vue')"
      :custom-data="customCrudData"
    />
  </div>

</template>
<script>
import { defineComponent } from 'vue';
import controller from './controller';
import purchaseModal from "../../../_components/purchaseModal/index.vue";

export default defineComponent({
  props: {},
  components: {purchaseModal},
  setup() {
    return { ...controller() };
  }
});
</script>
<style lang="scss">
</style>
