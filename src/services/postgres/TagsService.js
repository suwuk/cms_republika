const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class TagsService {
  constructor() {
    this._pool = new Pool();
  }

  async addTag(name) {
    const id = `tag-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO tags VALUES($1, $2) RETURNING tag_id',
      values: [id, name],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].tag_id) {
      throw new InvariantError('Tag gagal ditambahkan');
    }

    return result.rows[0].tag_id;
  }

  async getTags() {
    const result = await this._pool.query('SELECT * FROM tags');
    return result.rows;
  }

  async getTagById(id) {
    const query = {
      text: 'SELECT * FROM tags WHERE tag_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Tag tidak ditemukan');
    }

    return result.rows[0];
  }

  async editTagById(id, name) {
    const query = {
      text: 'UPDATE tags SET name = $1 WHERE tag_id = $2 RETURNING tag_id',
      values: [name, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui tag. Id tidak ditemukan');
    }
  }

  async deleteTagById(id) {
    const query = {
      text: 'DELETE FROM tags WHERE tag_id = $1 RETURNING tag_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Tag gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = TagsService;
