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
  providers: {
    permission: 'iaccounting.providers.manage',
    activated: true,
    authenticated: true,
    path: '/accounting/providers/index',
    name: 'qaccounting.admin.providers',
    crud: import('src/modules/qaccounting/_crud/providers.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'iaccounting.cms.sidebar.adminProviders',
    icon: 'fa-light fa-users-rectangle',
    subHeader: {
      refresh: true,
    }
  },
  origins: {
    permission: 'iaccounting.origins.manage',
    activated: true,
    authenticated: true,
    path: '/accounting/apikeys/index',
    name: 'qaccounting.admin.origins',
    crud: import('src/modules/qaccounting/_crud/origins.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'iaccounting.cms.sidebar.adminOrigins',
    icon: 'fa-light fa-key',
    subHeader: {
      refresh: true,
    }
  }
}
