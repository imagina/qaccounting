import {reactive, toRefs, computed, ref} from 'vue';
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
    showError: false,
    errorObj: null,
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
        read: {
          actions: [
            {//Retry action
              icon: 'fa-light fa-arrow-rotate-right',
              name: 'edit',
              label: i18n.tr('iaccounting.cms.button.retry')
            },
            {//Log action
              icon: 'fa-solid fa-file-lines',
              name: 'log',
              sortOrder: 1,
              label: i18n.tr('iaccounting.cms.title.viewLog'),
              action: (item: any) => {
                const err = item.options?.error;
                if (err) {
                  state.errorObj = err
                  state.showError = true
                }
              }
            },
          ]
        }
      };
    })
  };

  // Methods
  const methods = {
    openModal(item = null) {
      const TITLES = {
        2: 'iaccounting.cms.title.resendDocument',
        default: 'iaccounting.cms.title.infoDocument'
      }
      state.item = item
      const title = TITLES[item?.statusId] || TITLES.default
      state.modalTitle = i18n.tr(title)
      state.show = true
    },
    async getDataTable(refresh = true) {
      await refs.crudComponent.value.getDataTable(refresh);
    },
  };

  return {...refs, ...(toRefs(state)), ...computeds, ...methods};
}
