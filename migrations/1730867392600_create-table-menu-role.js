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
  pgm.createTable('menu_role', {
    role_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'roles(role_id)',
      onDelete: 'cascade',
    },
    menu_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'menu(menu_id)',
      onDelete: 'cascade',
    },
  });

  // Membuat composite primary key dari kedua kolom
  pgm.addConstraint('menu_role', 'menu_role_pkey', {
    primaryKey: ['role_id', 'menu_id'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('menu_role');
};
