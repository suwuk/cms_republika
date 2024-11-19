const autoBind = require('auto-bind');

class TagsHandler {
  constructor(service, logService, validator) {
    this._service = service;
    this._logService = logService;
    this._validator = validator;

    autoBind(this);
  }

  async postTagHandler(request, h) {
    this._validator.validateTagPayload(request.payload);
    const { name } = request.payload;

    const tagId = await this._service.addTag(name);
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'ADD_TAG',
      `Adding tag with ID: ${tagId}`,
    );

    const response = h.response({
      status: 'success',
      message: 'Tag berhasil ditambahkan',
      data: {
        tagId,
      },
    });
    response.code(201);
    return response;
  }

  async getTagsHandler() {
    const tags = await this._service.getTags();
    return {
      status: 'success',
      data: {
        tags,
      },
    };
  }

  async getTagByIdHandler(request) {
    const { id } = request.params;
    const tag = await this._service.getTagById(id);
    return {
      status: 'success',
      data: {
        tag,
      },
    };
  }

  async putTagByIdHandler(request) {
    this._validator.validateTagPayload(request.payload);
    const { id } = request.params;
    const { name } = request.payload;

    await this._service.editTagById(id, name);
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'EDIT_TAG',
      `Editing tag with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Tag berhasil diperbarui',
    };
  }

  async deleteTagByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteTagById(id);
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'DELETE_TAG',
      `Deleting tag with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Tag berhasil dihapus',
    };
  }
}

module.exports = TagsHandler;
