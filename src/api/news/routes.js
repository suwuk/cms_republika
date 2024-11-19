const routes = (handler) => [
  {
    method: 'POST',
    path: '/news',
    handler: handler.postNewsHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'GET',
    path: '/news',
    handler: handler.getNewsHandler,
  },
  {
    method: 'GET',
    path: '/news/{id}',
    handler: handler.getNewsByIdHandler,
  },
  {
    method: 'PUT',
    path: '/news/{id}',
    handler: handler.putNewsByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/news/{id}',
    handler: handler.deleteNewsByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
];
module.exports = routes;
