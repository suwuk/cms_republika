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
  pgm.createTable('menu_roles', {
    role_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'roles',  // Referensi ke tabel roles
    },
    menu_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: 'menu',  // Referensi ke tabel menus
    },
  });

  // Membuat composite primary key dari role_id dan menu_id
  pgm.addConstraint('menu_roles', 'menu_roles_pkey', {
    primaryKey: ['role_id', 'menu_id'],
  });

  // Membuat index untuk meningkatkan performa query
  pgm.createIndex('menu_roles', 'role_id');
  pgm.createIndex('menu_roles', 'menu_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Menghapus tabel menu_roles
  pgm.dropTable('menu_roles');
};
