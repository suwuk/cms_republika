const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({
    username,
    fullname,
    email,
    password,
    forgetPassword,
    roleId,
  }) {
    await this.verifyNewAccount(username, email);
    // const userId = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    console.log(username);
    const query = {
      text: 'INSERT INTO users(username, fullname, email, password, forget_password, created_at, updated_at, role_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id',
      values: [
        username,
        fullname,
        email,
        hashedPassword,
        forgetPassword,
        createdAt,
        updatedAt,
        roleId,
      ],
    };

    const result = await this._pool.query(query);
    console.log(result);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].user_id;
  }

  async verifyNewAccount(username, email) {
    const query = {
      text: 'SELECT username, email FROM users WHERE username = $1 OR email = $2',
      values: [username, email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Gagal menambahkan user. Username atau email sudah digunakan.',
      );
    }
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT user_id, username, fullname FROM users WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyUserCredential(usermail, password) {
    const query = {
      text: 'SELECT user_id, username, fullname, email, password, role_id FROM users WHERE username = $1 OR email = $1',
      values: [usermail],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const {
      user_id,
      username,
      fullname,
      email,
      password: hashedPassword,
      role_id,
    } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return {
      user_id, username, fullname, email, role_id,
    };
  }
}

module.exports = UsersService;
