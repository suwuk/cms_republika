const autoBind = require('auto-bind');

class NewsTagsHandler {
  constructor(service, logService, validator) {
    this._service = service;
    this._logService = logService;
    this._validator = validator;

    autoBind(this);
  }

  async postNewsTagHandler(request, h) {
    // this._validator.validateNewsTagPayload({
    //   newsId: request.params.newsId,
    //   tagId: request.payload.tagId,
    // });
    const { newsId } = request.params;
    const { tagId } = request.payload;
    const { id: credentialId, fullname } = request.auth.credentials;

    const newsTag = await this._service.addNewsTag(newsId, tagId);

    await this._logService.addLog(
      credentialId,
      fullname,
      'ADD_NEWS_TAG',
      `Added tag ${tagId} to news ${newsId}`,
    );

    const response = h.response({
      status: 'success',
      message: 'Tag berhasil ditambahkan ke berita',
      data: newsTag,
    });
    response.code(201);
    return response;
  }

  async getNewsTagsHandler(request) {
    this._validator.validateNewsTagParams({
      newsId: request.params.newsId,
    });

    const { newsId } = request.params;
    const tags = await this._service.getNewsTags(newsId);
    return {
      status: 'success',
      data: {
        tags,
      },
    };
  }

  async deleteNewsTagHandler(request) {
    this._validator.validateNewsTagParams({
      newsId: request.params.newsId,
      tagId: request.params.tagId,
    });

    const { newsId, tagId } = request.params;
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._service.deleteNewsTag(newsId, tagId);
    await this._logService.addLog(
      credentialId,
      fullname,
      'DELETE_NEWS_TAG',
      `Removed tag ${tagId} from news ${newsId}`,
    );

    return {
      status: 'success',
      message: 'Tag berhasil dihapus dari berita',
    };
  }
}

module.exports = NewsTagsHandler;
