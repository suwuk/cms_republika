const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class NewsService {
  constructor() {
    this._pool = new Pool();
  }

  async addNews({
    title,
    content,
    status,
    scheduleDate,
    description,
    isHeadline,
    isUnggulan,
    reporter,
    userId,
    categoryId,
  }) {
    const newsId = `news-${nanoid(16)}`;
    // const createdAt = new Date().toISOString();
    // const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO news VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING news_id',
      values: [
        newsId,
        title,
        content,
        status,
        scheduleDate,
        description,
        isHeadline,
        isUnggulan,
        reporter,
        userId,
        categoryId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].news_id) {
      throw new InvariantError('Berita gagal ditambahkan');
    }

    return result.rows[0].news_id;
  }

  // async getNews() {
  //   const result = await this._pool.query('SELECT * FROM news');
  //   return result.rows;
  // }

  async getNews(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // Get total count for pagination info
    const countQuery = await this._pool.query('SELECT COUNT(*) FROM news');
    const totalItems = parseInt(countQuery.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data
    const query = {
      text: 'SELECT * FROM news ORDER BY schedule_date DESC LIMIT $1 OFFSET $2',
      values: [limit, offset],
    };

    const result = await this._pool.query(query);

    return {
      news: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems,
        totalPages,
      },
    };
  }

  async getNewsById(id) {
    const query = {
      text: 'SELECT * FROM news WHERE news_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Berita tidak ditemukan');
    }

    return result.rows[0];
  }

  async editNewsById(
    id,
    {
      title,
      content,
      status,
      scheduleDate,
      description,
      isHeadline,
      isUnggulan,
      reporter,
      categoryId,
    },
  ) {
    const query = {
      text: 'UPDATE news SET title = $1, content = $2, status = $3, schedule_date = $4, description = $5, is_headline = $6, is_unggulan = $7, reporter = $8, category_id = $9 WHERE news_id = $10 RETURNING news_id',
      values: [
        title,
        content,
        status,
        scheduleDate,
        description,
        isHeadline,
        isUnggulan,
        reporter,
        categoryId,
        id,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Berita. Id tidak ditemukan');
    }
  }

  async deleteNewsById(id) {
    const query = {
      text: 'DELETE FROM news WHERE news_id = $1 RETURNING news_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Berita gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NewsService;
