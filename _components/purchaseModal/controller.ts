import {computed, reactive, onMounted, toRefs, watch, onUnmounted, ref} from "vue";
import service from './services'
import {i18n, clone, alert} from 'src/plugins/utils'

export default function controller(props: any, emit: any) {
  // Refs
  const refs = {
    refForm: ref()
  }

  // States
  const state = reactive({
    show: false,
    formData: {},
    loading: false,
    n8nData: null
  })

  // Computed
  const computeds = {
    modalProps: computed(() => {
      //Validate params props
      if (!state.show) return {}

      const existn8nData = !!state.n8nData

      const title = existn8nData ? 'Corrobora la informacion' : props.title

      const actions = [
        {
          action: () => methods.closeModal(),
          props: {
            color: 'grey-5',
            label: i18n.tr('isite.cms.label.cancel'),
          }
        }
      ]

      if (existn8nData) {
        actions.push({
          action: () => refs.refForm.value.changeStep('next', true),
          props: {
            color: 'primary',
            label: i18n.tr('isite.cms.label.save'),
          }
        })
      } else {
        actions.push({
          action: () => methods.sendImage(),
          props: {
            color: 'primary',
            label: i18n.tr('isite.cms.label.upload'),
          }
        })
      }

      //Response
      return {
        title,
        width: 'max-content',
        persistent: true,
        loading: state.loading,
        actions
      }
    }),
    fields: computed(() => {
      //Validate params props
      if (!state.show) return []

      const existn8nData = !!state.n8nData

      let description = existn8nData ? "Asegurate que la información proporcionada es la correcta" : 'Puedes subir imagenes, pdf, docx, etc'

      let fields = {
        mediasSingle: {
          name: 'mediasSingle',
          value: {},
          required: true,
          type: 'media',
          props: {
            label: i18n.tr('isite.cms.form.firstImage'),
            zone: 'mainimage',
            entity: "Modules\\Iaccounting\\Entities\\Purchase",
            entityId: null
          }
        }
      }

      //Response
      return [{description, fields}]
    })
  }

  // Methods
  const methods = {
    sendImage: async () => {
      const data: any = state.formData
      if (data?.mediasSingle?.mainimage || true) {
        state.loading = true

        const attributes = {
          imageId: data?.mediasSingle?.mainimage
        }

        //Create purchase support
        await service.sendN8NImg({attributes}).then(response => {
          state.n8nData = response
        }).catch(() => {
          alert.error({message: i18n.tr('isite.cms.message.errorRequest')});
        })

        state.loading = false
      }
    },
    //Update block
    createItem: () => {
      if (state.formData) {
        state.loading = true

        //Create purchase support
        service.createItem(state.formData).then(response => {
          alert.info({message: i18n.tr('isite.cms.message.recordCreated')});
          //Emit info to Editor and Close Modal
          emit('create')
          methods.closeModal()
        }).catch(() => {
          alert.error({message: i18n.tr('isite.cms.message.recordNoCreated')});
          state.loading = false
        })
      }
    },
    closeModal() {
      state.show = false
      state.formData = {};
      state.loading = false;
    },
    isValidField(val) {
      console.warn(val)
    }
  }

  // Mounted
  onMounted(() => {
  })

  watch(() => props.modelValue, (newValue) => {
    state.show = clone(newValue);
  })

  watch(() => state.show, (newValue) => {
    emit('update:modelValue', newValue)
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
