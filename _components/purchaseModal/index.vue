<template>
  <master-modal v-model="show" custom-position v-bind="modalProps" @hide="closeModal" @show="setItem">
    <dynamic-form v-model="formData" :blocks="fields" hide-progress-bar no-actions ref="refForm" @submit="callMethods"/>
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
</style>
