const { Pool } = require('pg');
const slugify = require('slugify');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CategoriesService {
  constructor() {
    this._pool = new Pool();
  }

  async addCategory({ name, id_parent = 0 }) {
    const slug = slugify(name, { lower: true, strict: true });

    const query = {
      text: 'INSERT INTO categories (name, id_parent, slug) VALUES($1, $2, $3) RETURNING category_id',
      values: [name, id_parent, slug],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].category_id) {
      throw new InvariantError('Kategori gagal ditambahkan');
    }

    return result.rows[0].category_id;
  }

  async getCategories() {
    const result = await this._pool.query('SELECT * FROM categories');
    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: 'SELECT * FROM categories WHERE category_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    return result.rows[0];
  }

  async getCategoryBySlug(slug) {
    const query = {
      text: 'SELECT * FROM categories WHERE slug = $1',
      values: [slug],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    return result.rows[0];
  }

  async editCategoryById(id, { name, id_parent }) {
    const slug = slugify(name, { lower: true, strict: true });

    const query = {
      text: 'UPDATE categories SET name = $1, slug = $2, id_parent = $3 WHERE category_id = $4 RETURNING category_id',
      values: [name, slug, id_parent, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui kategori. Id tidak ditemukan');
    }
  }

  async deleteCategoryById(id) {
    const query = {
      text: 'DELETE FROM categories WHERE category_id = $1 RETURNING category_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kategori gagal dihapus. Id tidak ditemukan');
    }
  }

  async getSubCategories(parentId) {
    const query = {
      text: 'SELECT * FROM categories WHERE id_parent = $1',
      values: [parentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CategoriesService;
