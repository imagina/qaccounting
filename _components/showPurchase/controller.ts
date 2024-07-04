import Vue, {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import service from './services'
import {i18n} from 'src/plugins/utils'

export default function controller(props: any, emit: any) {
  // Refs
  const refs = {}

  // States
  const state = reactive({
    data: {},
    show: false,
    response: {},
    loading: false,
    fields: []
  })

  // Computed
  const computeds = {
    modalProps: computed(() => {
      //Validate params props
      if (!state.show) return {}

      const actions = !props.item?.id ? [
        {
          props: {
            color: 'green',
            label: i18n.tr('isite.cms.label.save')
          },
          action: () => methods.createItem()
        }
      ] : [];

      //Response
      return {
        title: (!props.item?.id) ? props.title : `${props.title} - ID: ${props.idBlock}`,
        width: 'max-content',
        loading: state.loading,
        actions
      }
    })
  }

  // Methods
  const methods = {
    init() {
      if (props.item?.id) {
        methods.getData()
      }
    },
    getConfigBlocks: async () => {
      state.loading = true

      //Instance the request params
      const requestParams = {filter: {allTranslations: true, configNameByModule: 'blocks'}}

      try {
        //Get configs
        const moduleConfigs = await builderService.getModuleBlocks(true, requestParams)
        builderService.getConfigBlocks(moduleConfigs)
      } catch (error) {
        //@ts-ignore
        proxy.$apiResponse.handleError(error, () => {
          console.error("[Ibuilder Get Configs]: ", error)
        })
      }

      state.loading = false
    },
    async getData() {
      if (props.idBlock && state.show) {
        state.loading = true
        try {
          //Get configs
          const block = await service.getOneBlock(true, props.idBlock)
          state.block = proxy.$clone(block)
          state.formBlock = proxy.$clone(block)
          state.fields = methods.getFormContentFields(block.component?.systemName)
        } catch (error) {
          //@ts-ignore
          proxy.$apiResponse.handleError(error, () => {
            console.error("[Ibuilder Get Data]: ", error)
          })
        }

        state.loading = false
      }
    },
    //Update block
    createItem: () => {
      if (state.block) {
        state.loading = true
        const block = {
          ...state.block,
          ...state.formBlock
        }

        //Update block with editor service
        builderService.updateBlock(block.id, block).then(response => {
          proxy.$alert.info({message: proxy.$tr('isite.cms.message.recordUpdated')});
          //Emit info to Editor and Close Modal
          emit('update')
          methods.closeModal()
        }).catch(() => {
          proxy.$alert.error({message: proxy.$tr('isite.cms.message.recordNoUpdated')});
          state.loading = false
        })
      }
    },
    closeModal() {
      state.show = false
      state.block = {} as Block;
      state.formBlock = {};
      state.loading = false;
      state.fields = []
    },
    getFormContentFields(systemName: string) {
      const response: any[] = []
      const configs = store.blockConfigs;
      const principal = configs.find(c => c.systemName == systemName);

      if (principal) {
        if (principal.contentFields) {
          const fields = methods.addFakeFieldName(principal.contentFields, 'componentAttributes')
          response.push({name: principal.systemName, title: principal.title, fields})
        }
        //@ts-ignore
        Object.entries(principal.childBlocks).forEach(child => {
          const [name, systemName] = child
          const block = configs.find(c => c.systemName == systemName)

          if (block && block?.contentFields) {
            const fields = methods.addFakeFieldName(block.contentFields, name)
            response.push({name: block.systemName, title: block.title, fields})
          }
        })
      }
      return response;
    },
    addFakeFieldName(fields, name) {
      const tmpField = {};
      //Set fakeFieldName
      for (const [fieldName, field] of Object.entries(fields)) {
        tmpField[fieldName] = {
          //@ts-ignore
          ...field,
          ...(field?.type !== 'media' ? {fakeFieldName: name} : {fieldItemId: props.idBlock})
        }
      }

      return tmpField
    },
  }

  // Mounted
  onMounted(() => {
    methods.getConfigBlocks()
  })

  watch(() => props.value, (newValue) => {
    state.show = proxy.$clone(newValue);
    methods.init()
  })

  watch(() => state.show, (newValue) => {
    emit('input', newValue)
  })

  watch(() => store.blockConfigs, (newValue) => {
    methods.init();
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
