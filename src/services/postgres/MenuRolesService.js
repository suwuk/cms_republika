const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class MenuRolesService {
  constructor() {
    this._pool = new Pool();
  }

  async addMenuRole(roleId, menuId) {
    const query = {
      text: 'INSERT INTO menu_roles (role_id, menu_id) VALUES($1, $2) RETURNING role_id, menu_id',
      values: [roleId, menuId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new InvariantError('Menu role gagal ditambahkan');
    }

    return result.rows[0];
  }

  async addBulkMenuRoles(roleId, menuIds) {
    const client = await this._pool.connect();
    try {
      await client.query('BEGIN');

      // Hapus menu roles yang ada untuk role tersebut
      await client.query('DELETE FROM menu_roles WHERE role_id = $1', [roleId]);

      // Insert menu roles baru
      const insertPromises = menuIds.map((menuId) => {
        const query = {
          text: 'INSERT INTO menu_roles (role_id, menu_id) VALUES($1, $2)',
          values: [roleId, menuId],
        };
        return client.query(query);
      });

      await Promise.all(insertPromises);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw new InvariantError('Gagal menambahkan bulk menu roles');
    } finally {
      client.release();
    }
  }

  async getMenuRolesByRoleId(roleId) {
    const query = {
      text: `SELECT mr.role_id, mr.menu_id, m.name as menu_name, m.url, m.status
             FROM menu_roles mr 
             JOIN menu m ON mr.menu_id = m.menu_id 
             WHERE mr.role_id = $1`,
      //  ORDER BY m.order_number`,
      values: [roleId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyMenuRole(roleId, menuId) {
    const query = {
      text: 'SELECT * FROM menu_roles WHERE role_id = $1 AND menu_id = $2',
      values: [roleId, menuId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Menu role tidak ditemukan');
    }
  }

  async deleteMenuRole(roleId, menuId) {
    const query = {
      text: 'DELETE FROM menu_roles WHERE role_id = $1 AND menu_id = $2 RETURNING role_id',
      values: [roleId, menuId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Menu role gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteMenuRolesByRoleId(roleId) {
    const query = {
      text: 'DELETE FROM menu_roles WHERE role_id = $1 RETURNING role_id',
      values: [roleId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Menu roles gagal dihapus. Role Id tidak ditemukan',
      );
    }
  }

  async verifyMenuRoleAccess(roleId, menuId) {
    const query = {
      text: 'SELECT * FROM menu_roles WHERE role_id = $1 AND menu_id = $2',
      values: [roleId, menuId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Anda tidak memiliki akses ke menu ini');
    }
  }
}

module.exports = MenuRolesService;
