<template>
  <master-modal id="purchaseModal" v-model="show" custom-position v-bind="modalProps" @hide="closeModal">
    <div class="row">
      <dynamic-form :class="`col-12 ${!!n8nData && !!file ? 'col-md-6' : ''}`" v-model="formData" :blocks="fields" hide-progress-bar no-actions ref="refForm" @submit="callMethods"
                    no-reset-with-blocks-update/>

      <div v-if="!!n8nData && file" id="showFile" class="col-6">
        <preview-file :url="file.url" :extension="file.extension"
                      :img-props="{height: 'calc(100vh - 200px)', class:'img-file full-height'}" />
      </div>
    </div>

  </master-modal>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'
import previewFile from 'src/modules/qsite/_components/v3/previewFile/index.vue'

export default defineComponent({
  props: {
    modelValue: {default: false},
    title: {default: ''},
    item: {default: null}
  },
  components: {previewFile},
  emits: ['create', 'update:modelValue'],
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
#purchaseModal {
  #dynamicFormComponentContent {
    box-shadow: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  @media screen and (max-width: $breakpoint-md-min) {
    #showFile {
      display: none;
    }
  }

  .contentImage {
    overflow: initial;
    position: relative;
    max-height: calc(100vh - 100px);
    box-shadow: none;
  }

  .q-card {
    max-height: calc(100vh - 100px);
    position: relative;

    img {
      max-height: calc(100vh - 100px);
    }
  }
}

</style>
