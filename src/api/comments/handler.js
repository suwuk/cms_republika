const autoBind = require('auto-bind');

class CommentsHandler {
  constructor(service, logService, validator) {
    this._service = service;
    this._logService = logService;
    this._validator = validator;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    this._validator.validateCommentPayload(request.payload);
    const { newsId } = request.params;
    const { content } = request.payload;
    const { id: credentialId, fullname } = request.auth.credentials;

    const commentId = await this._service.addComment({
      content,
      userId: credentialId,
      newsId,
    });

    await this._logService.addLog(
      credentialId,
      fullname,
      'ADD_COMMENT',
      `Adding comment with ID: ${commentId}`,
    );

    const response = h.response({
      status: 'success',
      message: 'Comment added successfully',
      data: {
        commentId,
      },
    });
    response.code(201);
    return response;
  }

  async getCommentsHandler(request) {
    const { newsId } = request.params;
    const comments = await this._service.getComments(newsId);
    return {
      status: 'success',
      data: {
        comments,
      },
    };
  }

  async deleteCommentHandler(request) {
    const { id: commentId } = request.params;
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._service.verifyCommentOwner(commentId, credentialId);
    await this._service.deleteComment(commentId);

    await this._logService.addLog(
      credentialId,
      fullname,
      'DELETE_COMMENT',
      `Deleting comment with ID: ${commentId}`,
    );

    return {
      status: 'success',
      message: 'Comment deleted successfully',
    };
  }

  async putCommentHandler(request) {
    this._validator.validateCommentPayload(request.payload);
    const { id: commentId } = request.params;
    const { content } = request.payload;
    const { id: credentialId, fullname } = request.auth.credentials;

    await this._service.verifyCommentOwner(commentId, credentialId);
    await this._service.updateComment(commentId, { content });

    await this._logService.addLog(
      credentialId,
      fullname,
      'UPDATE_COMMENT',
      `Updating comment with ID: ${commentId}`,
    );

    return {
      status: 'success',
      message: 'Comment updated successfully',
    };
  }
}

module.exports = CommentsHandler;
