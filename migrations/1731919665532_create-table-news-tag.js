/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('news_tag', {
    news_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'news',
      onDelete: 'CASCADE',
    },
    tag_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'tags',
      onDelete: 'CASCADE',
    },
  });

  // Add composite primary key
  pgm.addConstraint('news_tag', 'news_tag_pkey', {
    primaryKey: ['news_id', 'tag_id'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('news_tag');
};
