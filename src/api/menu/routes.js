const routes = (handler) => [
  {
    method: 'POST',
    path: '/menus',
    handler: handler.postMenuHandler,
    options: {
      auth: 'cms_jwt',
    },

  },
  {
    method: 'GET',
    path: '/menus',
    handler: handler.getMenusHandler,
  },
  {
    method: 'GET',
    path: '/menus/{id}',
    handler: handler.getMenuByIdHandler,
  },
  {
    method: 'PUT',
    path: '/menus/{id}',
    handler: handler.putMenuByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/menus/{id}',
    handler: handler.deleteMenuByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
];

module.exports = routes;
