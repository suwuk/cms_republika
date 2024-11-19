const routes = (handler) => [
  {
    method: 'POST',
    path: '/tags',
    handler: handler.postTagHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'GET',
    path: '/tags',
    handler: handler.getTagsHandler,
  },
  {
    method: 'GET',
    path: '/tags/{id}',
    handler: handler.getTagByIdHandler,
  },
  {
    method: 'PUT',
    path: '/tags/{id}',
    handler: handler.putTagByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/tags/{id}',
    handler: handler.deleteTagByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
];

module.exports = routes;
