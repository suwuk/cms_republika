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
  pgm.addConstraint(
    'news',
    'fk_news.user_id_users.user_id',
    'FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'news',
    'fk_news.category_id_categories.category_id',
    'FOREIGN KEY(category_id) REFERENCES categories(category_id) ON DELETE CASCADE',
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('news', 'fk_news.user_id_users.user_id');
  pgm.dropConstraint('news', 'fk_news.category_id_categories.category_id');
};
