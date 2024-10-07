<template>
  <master-modal id="purchaseModal" v-model="show" custom-position v-bind="modalProps" @hide="closeModal" @show="setItem">
    <div class="row">
      <div v-if="!!n8nData && file" id="showFile" class="col-6">
        <div v-if="file.isImage" class="contentImage text-center">
          <!--Image-->
          <q-card class="q-pa-sm q-mb-sm"><img :src="file.url"></q-card>
        </div>
        <iframe v-else
          :src="file.url"
          width="100%" style="height: calc(100vh - 100px)"
        />
      </div>
      <dynamic-form :class="`col-12 ${!!n8nData && !!file ? 'col-md-6' : ''}`" v-model="formData" :blocks="fields" hide-progress-bar no-actions ref="refForm" @submit="callMethods"
                    no-reset-with-blocks-update/>
    </div>

  </master-modal>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'

export default defineComponent({
  props: {
    modelValue: {default: false},
    title: {default: ''},
    item: {default: null}
  },
  components: {},
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
