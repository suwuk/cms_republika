const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CommentsService {
  constructor() {
    this._pool = new Pool();
  }

  async addComment({ content, userId, newsId }) {
    const id = `comment-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING comment_id',
      values: [id, content, createdAt, updatedAt, userId, newsId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].comment_id) {
      throw new InvariantError('Comment failed to add');
    }

    return result.rows[0].comment_id;
  }

  async getComments(newsId) {
    const query = {
      text: `SELECT comments.comment_id, comments.content, comments.created_at, users.username 
             FROM comments 
             LEFT JOIN users ON users.user_id = comments.user_id 
             WHERE comments.news_id = $1 
             ORDER BY comments.created_at DESC`,
      values: [newsId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteComment(commentId) {
    const query = {
      text: 'DELETE FROM comments WHERE comment_id = $1 RETURNING comment_id',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment not found');
    }
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment not found');
    }

    const comment = result.rows[0];

    if (comment.user_id !== userId) {
      throw new AuthorizationError('You don\'t have access to this resource');
    }
  }

  async updateComment(commentId, { content }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE comments SET content = $1, updated_at = $2 WHERE comment_id = $3 RETURNING *',
      values: [content, updatedAt, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update comment. Comment not found');
    }

    return result.rows[0];
  }
}

module.exports = CommentsService;
