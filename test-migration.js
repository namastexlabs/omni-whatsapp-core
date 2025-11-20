#!/usr/bin/env node
const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');

async function testMigration() {
  const pglite = new PGlite(process.env.PGLITE_DATA_DIR);

  try {
    const sql = fs.readFileSync('prisma/postgresql-migrations/20240808210239_add_column_function_url_openaibot_table/migration.sql', 'utf8');

    console.log('SQL to execute:');
    console.log(sql);
    console.log('\nExecuting...\n');

    const result = await pglite.query(sql);
    console.log('✅ Success:', result);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testMigration();
