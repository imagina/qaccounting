<template>
  <master-modal v-model="show" custom-position v-bind="modalProps" @hide="closeModal">
    <dynamic-form v-model="formData" :loading="loading" :blocks="fields" />
  </master-modal>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'

export default defineComponent({
  props: {
    modelValue: {default: false},
    title: {default: ''}
  },
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="stylus">
</style>
