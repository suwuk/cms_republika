const routes = (handler) => [
  {
    method: 'POST',
    path: '/news/{newsId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'GET',
    path: '/news/{newsId}/comments',
    handler: handler.getCommentsHandler,
  },
  {
    method: 'PUT',
    path: '/comments/{id}',
    handler: handler.putCommentHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/comments/{id}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
];

module.exports = routes;
