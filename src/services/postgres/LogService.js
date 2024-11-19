const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class LogService {
  constructor() {
    this._pool = new Pool();
  }

  async addLog(userId, fullname, action, description) {
    const logId = `log-${nanoid(16)}`;
    const actionDate = new Date().toISOString();

    const query = {
      text: 'INSERT INTO log VALUES($1, $2, $3, $4, $5, $6) RETURNING log_id',
      values: [logId, userId, fullname, action, description, actionDate],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].log_id) {
      throw new InvariantError('Log gagal ditambahkan');
    }

    return result.rows[0].log_id;
  }
}

module.exports = LogService;
