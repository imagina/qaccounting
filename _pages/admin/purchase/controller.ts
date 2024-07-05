import { reactive, toRefs, computed, ref } from 'vue';
// @ts-ignore
import crud from 'src/modules/qcrud/_components/crud.vue';

export default function controller() {

  // Refs
  const refs = {
    crudComponent: ref(crud),
  };

  // States
  const state = reactive({
    show: false
  });

  // Computed
  const computeds = {
    customCrudData: computed(() => {
      return {
        create: {
          method: () => methods.openModal()
        },
      };
    })
  };

  // Methods
  const methods = {
    openModal() {
      state.show = true
    },
    async getDataTable(refresh = true) {
      await refs.crudComponent.value.getDataTable(refresh);
    },
  };

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
