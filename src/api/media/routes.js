const routes = (handler) => [
  {
    method: 'POST',
    path: '/media',
    handler: handler.postMediaHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'GET',
    path: '/media/{id}',
    handler: handler.getMediaByIdHandler,
  },
  {
    method: 'GET',
    path: '/news/{newsId}/media',
    handler: handler.getMediaByNewsIdHandler,
  },
  {
    method: 'PUT',
    path: '/media/{id}',
    handler: handler.putMediaByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/media/{id}',
    handler: handler.deleteMediaByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
];

module.exports = routes;
