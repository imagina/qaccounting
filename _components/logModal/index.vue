<template>
  <master-modal id="logModal" v-model="show" v-bind="modalProps" @hide="closeModal">
    <div class="q-mx-auto">
      <q-card-section class="q-py-xs">
        <div class="text-h6 text-negative">Error: {{ error?.code }}</div>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <p>{{ error?.message }}</p>
        <p><strong>Detail:</strong> <a :href="error?.detail" target="_blank" class="text-primary">API Documentation</a></p>
        <p><strong>Params:</strong> {{ error?.params?.join(", ") }}</p>
      </q-card-section>
    </div>
  </master-modal>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'

export default defineComponent({
  props: {
    modelValue: {default: false},
    error: {default: null},
    title: {default: ''},
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
