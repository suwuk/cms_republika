const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class NewsTagService {
  constructor() {
    this._pool = new Pool();
  }

  async addNewsTag(newsId, tagId) {
    const checkNews = {
      text: 'SELECT * FROM news WHERE news_id = $1',
      values: [newsId],
    };
    const newsResult = await this._pool.query(checkNews);
    if (!newsResult.rowCount) {
      throw new NotFoundError('News tidak ditemukan');
    }

    const checkTag = {
      text: 'SELECT * FROM tags WHERE tag_id = $1',
      values: [tagId],
    };
    const tagResult = await this._pool.query(checkTag);
    if (!tagResult.rowCount) {
      throw new NotFoundError('Tag tidak ditemukan');
    }

    const checkRelation = {
      text: 'SELECT * FROM news_tag WHERE news_id = $1 AND tag_id = $2',
      values: [newsId, tagId],
    };
    const relationResult = await this._pool.query(checkRelation);
    if (relationResult.rowCount > 0) {
      throw new InvariantError('Tag sudah ada pada berita ini');
    }

    const query = {
      text: 'INSERT INTO news_tag (news_id, tag_id) VALUES($1, $2) RETURNING *',
      values: [newsId, tagId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getNewsTags(newsId) {
    const query = {
      text: `
        SELECT t.tag_id, t.name 
        FROM tags t
        INNER JOIN news_tag nt ON t.tag_id = nt.tag_id 
        WHERE nt.news_id = $1
        ORDER BY t.name ASC
      `,
      values: [newsId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getNewsIdsByTagId(tagId) {
    const query = {
      text: 'SELECT news_id FROM news_tag WHERE tag_id = $1',
      values: [tagId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => row.news_id);
  }

  async deleteNewsTag(newsId, tagId) {
    const query = {
      text: 'DELETE FROM news_tag WHERE news_id = $1 AND tag_id = $2 RETURNING *',
      values: [newsId, tagId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Tag tidak ditemukan pada berita tersebut');
    }

    return result.rows[0];
  }

  async deleteNewsTags(newsId) {
    const query = {
      text: 'DELETE FROM news_tag WHERE news_id = $1 RETURNING *',
      values: [newsId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = NewsTagService;
