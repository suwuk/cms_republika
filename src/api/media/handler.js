const autoBind = require('auto-bind');

class MediaHandler {
  constructor(service, logService, validator) {
    this._service = service;
    this._logService = logService;
    this._validator = validator;

    autoBind(this);
  }

  async postMediaHandler(request, h) {
    this._validator.validateMediaPayload(request.payload);
    const {
      filename, url, mediaType, newsId,
    } = request.payload;

    const mediaId = await this._service.addMedia({
      filename,
      url,
      mediaType,
      newsId,
    });

    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'ADD_MEDIA',
      `Added media with ID: ${mediaId}`,
    );

    const response = h.response({
      status: 'success',
      message: 'Media berhasil ditambahkan',
      data: {
        mediaId,
      },
    });
    response.code(201);
    return response;
  }

  async getMediaByIdHandler(request) {
    const { id } = request.params;
    const media = await this._service.getMediaById(id);

    return {
      status: 'success',
      data: {
        media,
      },
    };
  }

  async getMediaByNewsIdHandler(request) {
    const { newsId } = request.params;
    const media = await this._service.getMediaByNewsId(newsId);

    return {
      status: 'success',
      data: {
        media,
      },
    };
  }

  async putMediaByIdHandler(request) {
    this._validator.validateMediaPayload(request.payload);
    const { id } = request.params;
    const { filename, url, mediaType } = request.payload;

    await this._service.editMediaById(id, {
      filename,
      url,
      mediaType,
    });

    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'EDIT_MEDIA',
      `Updated media with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Media berhasil diperbarui',
    };
  }

  async deleteMediaByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteMediaById(id);

    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'DELETE_MEDIA',
      `Deleted media with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Media berhasil dihapus',
    };
  }
}

module.exports = MediaHandler;
