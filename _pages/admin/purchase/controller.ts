import { reactive, toRefs, computed, ref } from 'vue';
// @ts-ignore
import crud from 'src/modules/qcrud/_components/crud.vue';
import {i18n} from 'src/plugins/utils'

export default function controller() {

  // Refs
  const refs = {
    crudComponent: ref(crud),
  };

  // States
  const state = reactive({
    show: false,
    item: null,
    modalTitle: i18n.tr('iaccounting.cms.title.uploadDocument')
  });

  // Computed
  const computeds = {
    customCrudData: computed(() => {
      return {
        create: {
          method: () => methods.openModal()
        },
        update: {
          method: (item: any) => methods.openModal(item)
        },
      };
    })
  };

  // Methods
  const methods = {
    openModal(item = null) {
      state.item = item
      state.modalTitle = i18n.tr('iaccounting.cms.title.infoDocument')
      state.show = true
    },
    async getDataTable(refresh = true) {
      await refs.crudComponent.value.getDataTable(refresh);
    },
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
