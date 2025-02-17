import {computed, reactive, toRefs, watch} from "vue";
import {clone, i18n} from 'src/plugins/utils'
export default function controller(props: any, emit: any) {
  // States
  const state = reactive({
    show: false
  })

  // Computed
  const computeds = {
    modalProps: computed(() => {
      //Validate params props
      if (!state.show) return {}
      //Response
      return {
        title: props.title,
        actions: [
          {
            action: () => methods.closeModal(),
            props: {
              color: 'grey-5',
              textColor: 'grey-8',
              label: i18n.tr('isite.cms.label.close'),
            }
          }
        ]
      }
    })
  }

  // Methods
  const methods = {
    closeModal() {
      state.show = false;
    }
  }

  watch(() => props.modelValue, (newValue) => {
    state.show = clone(newValue);
  })

  watch(() => state.show, (newValue) => {
    emit('update:modelValue', newValue)
  })

  return {...(toRefs(state)), ...computeds, ...methods}
}
