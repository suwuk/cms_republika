const routes = (handler) => [
  {
    method: 'POST',
    path: '/categories',
    handler: handler.postCategoryHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'GET',
    path: '/categories',
    handler: handler.getCategoriesHandler,
  },
  {
    method: 'GET',
    path: '/categories/{id}',
    handler: handler.getCategoryByIdHandler,
  },
  {
    method: 'GET',
    path: '/categories/sub/{id}',
    handler: handler.getSubCategoriesHandler,
  },
  {
    method: 'PUT',
    path: '/categories/{id}',
    handler: handler.putCategoryByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    handler: handler.deleteCategoryByIdHandler,
    options: {
      auth: 'cms_jwt',
    },
  },
  {
    method: 'GET',
    path: '/categories/slug/{slug}',
    handler: handler.getCategoryBySlugHandler,
  },
];

module.exports = routes;
