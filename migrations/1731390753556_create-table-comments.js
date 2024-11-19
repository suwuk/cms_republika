/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('comments', {
    comment_id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    //   default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'TEXT',
    },
    user_id: {
      type: 'INTEGER',
      notNull: true,
    },
    news_id: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
  });

  // Add foreign key constraints
  pgm.addConstraint('comments', 'fk_comments.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(user_id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('comments', 'fk_comments.news_id_news.id', {
    foreignKeys: {
      columns: 'news_id',
      references: 'news(news_id)',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('comments');
};
