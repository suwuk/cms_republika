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
  pgm.createTable('menu', {
    menu_id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: false,
    },
    url: {
      type: 'TEXT',
      notNull: false,
    },
    status: {
      type: 'INTEGER',
    },
    id_parent: {
      type: 'VARCHAR(30)',
      references: 'menu(menu_id)', // self-referencing foreign key
      onDelete: 'cascade',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('menu');
};
