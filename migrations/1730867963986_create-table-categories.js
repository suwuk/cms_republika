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
  pgm.createTable('categories', {
    category_id: {
      type: 'SERIAL',
      primaryKey: true,
      // identity: {
      //   always: true,
      // },
    },
    name: {
      type: 'VARCHAR(30)',
      notNull: false,
    },
    id_parent: {
      type: 'INTEGER',
      // references: 'categories(category_id)', // self-referencing foreign key
      // onDelete: 'cascade',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('categories');
};
