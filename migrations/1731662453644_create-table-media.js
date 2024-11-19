/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('media', {
    media_id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    filename: {
      type: 'TEXT',
      notNull: true,
    },
    url: {
      type: 'TEXT',
    },
    media_type: {
      type: 'VARCHAR(50)',
    },
    created_at: {
      type: 'TEXT',
    },
    updated_at: {
      type: 'TEXT',
    },
    news_id: {
      type: 'VARCHAR(30)',
    //   references: 'news',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('media');
};
