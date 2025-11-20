#!/usr/bin/env node
const { PGlite } = require('@electric-sql/pglite');

async function inspectInstanceTable() {
  const pglite = new PGlite(process.env.PGLITE_DATA_DIR);

  try {
    // Get column information for Instance table
    const result = await pglite.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Instance'
      ORDER BY ordinal_position;
    `);

    console.log(`\nInstance table has ${result.rows.length} columns:`);
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})${row.is_nullable === 'YES' ? ' NULL' : ' NOT NULL'}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

inspectInstanceTable();
