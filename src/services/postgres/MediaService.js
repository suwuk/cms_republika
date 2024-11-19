const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class MediaService {
  constructor() {
    this._pool = new Pool();
  }

  async addMedia({
    filename, url, mediaType, newsId,
  }) {
    const id = `media-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO media VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING media_id',
      values: [id, filename, url, mediaType, createdAt, updatedAt, newsId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].media_id) {
      throw new InvariantError('Media gagal ditambahkan');
    }

    return result.rows[0].media_id;
  }

  async getMediaById(id) {
    const query = {
      text: 'SELECT * FROM media WHERE media_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Media tidak ditemukan');
    }

    return result.rows[0];
  }

  async getMediaByNewsId(newsId) {
    const query = {
      text: 'SELECT * FROM media WHERE news_id = $1',
      values: [newsId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async editMediaById(id, { filename, url, mediaType }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE media SET filename = $1, url = $2, media_type = $3, updated_at = $4 WHERE media_id = $5 RETURNING media_id',
      values: [filename, url, mediaType, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui media. Id tidak ditemukan');
    }
  }

  async deleteMediaById(id) {
    const query = {
      text: 'DELETE FROM media WHERE media_id = $1 RETURNING media_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Media gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = MediaService;
