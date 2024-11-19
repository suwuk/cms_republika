const routes = (handler) => [
  {
    method: 'POST',
    path: '/news/{newsId}/tags',
    handler: handler.postNewsTagHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'GET',
    path: '/news/{newsId}/tags',
    handler: handler.getNewsTagsHandler,
  },
  {
    method: 'DELETE',
    path: '/news/{newsId}/tags/{tagId}',
    handler: handler.deleteNewsTagHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
];

module.exports = routes;
