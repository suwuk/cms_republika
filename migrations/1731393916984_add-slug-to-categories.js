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
    pgm.addColumn('categories', {
        slug: {
          type: 'VARCHAR(100)',
          unique: true,
        },
      });
    
      // Generate initial slugs for existing categories
      pgm.sql(`
        UPDATE categories 
        SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
      `);
    
      // Make slug NOT NULL after populating
      pgm.alterColumn('categories', 'slug', {
        notNull: true,
      });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropColumn('categories', 'slug');
};
