/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('log', {
    log_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: 'INTEGER',
    },
    fullname: {
      type: 'TEXT',
    },
    action: {
      type: 'TEXT',
    },
    description: {
      type: 'TEXT',
    },
    action_date: {
      type: 'TEXT',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('log');
};
