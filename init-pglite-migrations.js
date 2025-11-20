#!/usr/bin/env node
/**
 * PGLite Migration Initializer
 * Applies all PostgreSQL migrations to a fresh PGLite database
 *
 * Run this ONCE after creating a new PGLite database to initialize the schema.
 */

const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env
require('dotenv').config();

console.log('\n🔧 PGLite Migration Initializer\n');

const dataDir = process.env.PGLITE_DATA_DIR || '/home/namastex/data/evolution-pglite';
console.log('Database location:', dataDir);

async function applyMigrations() {
  let pgliteDb;

  try {
    // Create PGLite instance
    console.log('\n[1/3] Connecting to PGLite database...');
    pgliteDb = new PGlite({ dataDir });
    console.log('✅ Connected');

    // Get all migrations
    console.log('\n[2/3] Reading migrations...');
    const migrationsDir = path.join(__dirname, 'prisma', 'postgresql-migrations');

    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found: ${migrationsDir}`);
    }

    const migrations = fs.readdirSync(migrationsDir)
      .filter(dir => !dir.startsWith('.'))
      .sort();

    console.log(`Found ${migrations.length} migration(s)`);

    // Apply each migration
    console.log('\n[3/3] Applying migrations...');
    let applied = 0;
    let skipped = 0;

    for (const migration of migrations) {
      const migrationFile = path.join(migrationsDir, migration, 'migration.sql');

      if (!fs.existsSync(migrationFile)) {
        console.log(`  ⚠ No migration.sql in ${migration}, skipping`);
        skipped++;
        continue;
      }

      const sql = fs.readFileSync(migrationFile, 'utf-8');

      try {
        await pgliteDb.exec(sql);
        console.log(`  ✓ Applied: ${migration}`);
        applied++;
      } catch (error) {
        // Check if error is because table already exists
        if (error.message.includes('already exists')) {
          console.log(`  → Skipped: ${migration} (already exists)`);
          skipped++;
        } else {
          console.log(`  ✗ Failed: ${migration}`);
          console.log(`    Error: ${error.message.split('\n')[0]}`);
          throw error;
        }
      }
    }

    console.log('\n✅ Migration complete!');
    console.log(`   Applied: ${applied}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total:   ${migrations.length}`);

    // Verify Instance table exists
    console.log('\n🔍 Verifying schema...');
    const result = await pgliteDb.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tables = result.rows.map(r => r.table_name);
    console.log(`Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`  • ${t}`));

    if (tables.includes('Instance')) {
      console.log('\n✅ Instance table verified - Evolution API should now work!');
    } else {
      console.log('\n⚠️ Warning: Instance table not found - there may be an issue');
    }

    return true;

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    return false;
  } finally {
    if (pgliteDb) {
      await pgliteDb.close();
      console.log('\n🔌 Database connection closed');
    }
  }
}

applyMigrations()
  .then(success => {
    if (success) {
      console.log('\n🎉 All done! You can now start Evolution API.\n');
      process.exit(0);
    } else {
      console.log('\n💥 Migration failed - check errors above.\n');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
