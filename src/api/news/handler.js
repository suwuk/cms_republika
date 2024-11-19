const autoBind = require('auto-bind');

class NewsHandler {
  constructor(service, logService, validator) {
    // constructor(service) { // untuk mongodb & dont forget comment this validator, log
    this._service = service;
    this._validator = validator;
    this._logService = logService;

    autoBind(this);
  }

  async postNewsHandler(request, h) {
    this._validator.validateNewsPayload(request.payload);
    const {
      title,
      content,
      status,
      scheduleDate,
      description,
      isHeadline,
      isUnggulan,
      reporter,
      categoryId,
    } = request.payload;
    const { id: credentialId, fullname } = request.auth.credentials;

    const newsId = await this._service.addNews({
      title,
      content,
      status,
      scheduleDate,
      description,
      isHeadline,
      isUnggulan,
      reporter,
      userId: credentialId,
      categoryId,
    });

    await this._logService.addLog(
      credentialId,
      fullname,
      'ADD_NEWS',
      `Added news with ID: ${newsId}`,
    );

    const response = h.response({
      status: 'success',
      message: 'Berita berhasil ditambahkan',
      data: {
        newsId,
      },
    });
    response.code(201);
    return response;
  }

  async getNewsHandler(request, h) {
    const { page, limit } = request.query;

    const { news, pagination } = await this._service.getNews(page, limit);

    const response = h.response({
      status: 'success',
      data: {
        news,
        pagination,
      },
    });
    response.code(200);
    return response;
  }

  async getNewsByIdHandler(request) {
    const { id } = request.params;
    const news = await this._service.getNewsById(id);
    return {
      status: 'success',
      data: {
        news,
      },
    };
  }

  async putNewsByIdHandler(request) {
    this._validator.validateNewsPayload(request.payload);
    const { id } = request.params;

    await this._service.editNewsById(id, request.payload);
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'EDIT_NEWS',
      `Updated news with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Berita berhasil diperbarui',
    };
  }

  async deleteNewsByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId, fullname } = request.auth.credentials;
    await this._service.deleteNewsById(id, credentialId, fullname);
    await this._logService.addLog(
      credentialId,
      fullname,
      'DELETE_NEWS',
      `Deleted news with ID: ${id}`,
    );
    return {
      status: 'success',
      message: 'Berita berhasil dihapus',
    };
  }
}

module.exports = NewsHandler;
