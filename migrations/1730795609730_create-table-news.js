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
  pgm.createTable('news', {
    news_id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    status: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    schedule_date: {
      type: 'TEXT',
      notNull: true,
    },
    // publication_date: {
    //   type: 'DATE',
    //   notNull: true,
    // },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    is_headline: {
      type: 'BOOLEAN',
      notNull: true,
    },
    is_unggulan: {
      type: 'BOOLEAN',
      notNull: true,
    },
    reporter: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    penulis_id: {
      type: 'INTEGER',
      notNull: true,
    },
    category_id: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('news');
};
