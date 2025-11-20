#!/usr/bin/env node
const { PGlite } = require('@electric-sql/pglite');

async function checkTables() {
  const pglite = new PGlite(process.env.PGLITE_DATA_DIR);

  try {
    const result = await pglite.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log(`Found ${result.rows.length} tables:`);
    result.rows.forEach(row => console.log(`  - ${row.tablename}`));

  } catch (error) {
    console.error('Error:', error);
  }
}

checkTables();
