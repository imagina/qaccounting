export default {
  purchases: {
    permission: 'iaccounting.purchases.manage',
    activated: true,
    authenticated: true,
    path: '/accounting/purchases/index',
    name: 'qaccounting.admin.purchases',
    crud : import('modules/qaccounting/_crud/purchases'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'iaccounting.cms.sidebar.adminPurchases',
    icon: 'fa-light fa-sack-dollar',
    subHeader: {
      refresh: true,
    }
  },
}
