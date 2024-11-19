const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class MenuService {
  constructor() {
    this._pool = new Pool();
  }

  async addMenu({
    name, url, status, id_parent = null,
  }) {
    const menu_id = `menu-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO menu VALUES($1, $2, $3, $4, $5) RETURNING menu_id',
      values: [menu_id, name, url, status, id_parent],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].menu_id) {
      throw new InvariantError('Menu gagal ditambahkan');
    }

    return result.rows[0].menu_id;
  }

  async getMenus() {
    const result = await this._pool.query('SELECT * FROM menu');
    return result.rows;
  }

  async getMenuById(menu_id) {
    const query = {
      text: 'SELECT * FROM menu WHERE menu_id = $1',
      values: [menu_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Menu tidak ditemukan');
    }

    return result.rows[0];
  }

  async editMenuById(menu_id, {
    name, url, status, id_parent = null,
  }) {
    const query = {
      text: 'UPDATE menu SET name = $1, url = $2, status = $3, id_parent = $4 WHERE menu_id = $5 RETURNING menu_id',
      values: [name, url, status, id_parent, menu_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui menu. Id tidak ditemukan');
    }
  }

  async deleteMenuById(menu_id) {
    const query = {
      text: 'DELETE FROM menu WHERE menu_id = $1 RETURNING menu_id',
      values: [menu_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Menu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = MenuService;
