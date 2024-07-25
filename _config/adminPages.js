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
  apikeys: {
    permission: 'iaccounting.apikeys.manage',
    activated: true,
    authenticated: true,
    path: '/accounting/apikeys/index',
    name: 'qaccounting.admin.apikeys',
    crud: import('src/modules/qaccounting/_crud/apiKeys.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'iaccounting.cms.sidebar.adminApiKeys',
    icon: 'fa-light fa-key',
    subHeader: {
      refresh: true,
    }
  },
  mappings: {
    permission: 'iaccounting.mappings.manage',
    activated: true,
    authenticated: true,
    path: '/accounting/mapping/index',
    name: 'qaccounting.admin.mappings',
    crud: import('src/modules/qaccounting/_crud/mapping.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'iaccounting.cms.sidebar.adminMappings',
    icon: 'fa-light fa-diagram-project',
    subHeader: {
      refresh: true,
    }
  },
}
