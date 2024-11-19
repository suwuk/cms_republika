const routes = (handler) => [
  {
    method: 'POST',
    path: '/menu-roles',
    handler: handler.postMenuRoleHandler,
    options: {
      auth: 'cms_jwt',
      // plugins: {
      //   rbac: {
      //     target: [
      //       {
      //         'credentials:roles': 'admin'
      //       }
      //     ],
      //     apply: 'permit'
      //   }
      // }
    },
  },
  {
    method: 'POST',
    path: '/menu-roles/bulk',
    handler: handler.postBulkMenuRolesHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'GET',
    path: '/menu-roles/{roleId}',
    handler: handler.getMenuRolesByRoleIdHandler,
  },
  {
    method: 'DELETE',
    path: '/menu-roles/{roleId}/{menuId}',
    handler: handler.deleteMenuRoleHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
];

module.exports = routes;
