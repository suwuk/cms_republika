const autoBind = require('auto-bind');

class CategoriesHandler {
  constructor(service, logService, validator) {
    this._service = service;
    this._logService = logService;
    this._validator = validator;

    autoBind(this);
  }

  async postCategoryHandler(request, h) {
    this._validator.validateCategoryPayload(request.payload);
    const { name, id_parent } = request.payload;
    const categoryId = await this._service.addCategory({ name, id_parent });
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'ADD_CATEGORY',
      `Adding category with ID: ${categoryId}`,
    );

    const response = h.response({
      status: 'success',
      message: 'Kategori berhasil ditambahkan',
      data: {
        categoryId,
      },
    });
    response.code(201);
    return response;
  }

  async getCategoriesHandler() {
    const categories = await this._service.getCategories();
    return {
      status: 'success',
      data: {
        categories,
      },
    };
  }

  async getCategoryByIdHandler(request) {
    const { id } = request.params;
    const category = await this._service.getCategoryById(id);
    return {
      status: 'success',
      data: {
        category,
      },
    };
  }

  async putCategoryByIdHandler(request) {
    this._validator.validateCategoryPayload(request.payload);
    const { id } = request.params;
    const { name, id_parent } = request.payload;

    await this._service.editCategoryById(id, { name, id_parent });
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'EDIT_CATEGORY',
      `Updated category with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Kategori berhasil diperbarui',
    };
  }

  async deleteCategoryByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteCategoryById(id);
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'DELETE_CATEGORY',
      `Deleted category with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Kategori berhasil dihapus',
    };
  }

  async getSubCategoriesHandler(request) {
    const { id } = request.params;
    const subCategories = await this._service.getSubCategories(id);

    return {
      status: 'success',
      data: {
        subCategories,
      },
    };
  }

  async getCategoryBySlugHandler(request) {
    const { slug } = request.params;
    const category = await this._service.getCategoryBySlug(slug);

    return {
      status: 'success',
      data: {
        category,
      },
    };
  }
}

module.exports = CategoriesHandler;
