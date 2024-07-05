export default {
  purchases: {
    permission: 'iaccounting.purchases.manage',
    activated: true,
    authenticated: true,
    path: '/accounting/purchases/index',
    name: 'qaccounting.admin.purchases',
    page: () => import('src/modules/qaccounting/_pages/admin/purchase/index.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'iaccounting.cms.sidebar.adminPurchases',
    icon: 'fa-light fa-sack-dollar',
    subHeader: {
      refresh: true,
    }
  },
}
