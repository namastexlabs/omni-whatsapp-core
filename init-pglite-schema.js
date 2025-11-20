#!/usr/bin/env node
/**
 * Initialize PGlite database schema
 * This script creates all tables in the PGlite database using Prisma
 */

const { PrismaClient } = require('@prisma/client');
const { PGlite } = require('@electric-sql/pglite');
const { PrismaPGlite } = require('pglite-prisma-adapter');

async function initSchema() {
  console.log('🔄 Initializing PGlite database schema...');
  console.log(`📁 Database location: ${process.env.PGLITE_DATA_DIR}`);

  // Create PGlite instance
  const pglite = new PGlite(process.env.PGLITE_DATA_DIR);
  const adapter = new PrismaPGlite(pglite);

  // Create Prisma client with PGlite adapter
  const prisma = new PrismaClient({
    adapter,
    log: ['info', 'warn', 'error'],
  });

  try {
    const fs = require('fs');
    const path = require('path');

    // Discover all migration directories
    const migrationsDir = path.join(__dirname, 'prisma/postgresql-migrations');
    const migrationDirs = fs.readdirSync(migrationsDir)
      .filter(name => {
        const fullPath = path.join(migrationsDir, name);
        return fs.statSync(fullPath).isDirectory();
      })
      .sort(); // Sort chronologically by timestamp prefix

    console.log(`📋 Found ${migrationDirs.length} migrations to apply`);
    console.log(`📝 First: ${migrationDirs[0]}`);
    console.log(`📝 Last: ${migrationDirs[migrationDirs.length - 1]}`);

    // Execute each migration in order
    for (let migIdx = 0; migIdx < migrationDirs.length; migIdx++) {
      const migrationName = migrationDirs[migIdx];
      const migrationFile = path.join(migrationsDir, migrationName, 'migration.sql');

      if (!fs.existsSync(migrationFile)) {
        console.log(`⚠️  Skipping ${migrationName} - no migration.sql found`);
        continue;
      }

      console.log(`\n🔄 [${migIdx + 1}/${migrationDirs.length}] Applying ${migrationName}...`);

      const sql = fs.readFileSync(migrationFile, 'utf8');

      try {
        // Use exec() instead of query() - it handles multiple statements
        await pglite.exec(sql);
        console.log(`   ✅ Executed successfully`);
      } catch (error) {
        // Idempotent: ignore errors for objects that already exist
        if (error.message && (error.message.includes('already exists') ||
                               error.message.includes('duplicate key') ||
                               error.code === '42P07' ||  // relation already exists
                               error.code === '42710')) {  // object already exists
          console.log(`   ℹ️  Migration already applied (objects exist)`);
        } else {
          console.error(`   ❌ Failed to execute migration`);
          console.error(`   Error: ${error.message}`);
          throw error;
        }
      }

      console.log(`   ✅ Migration ${migrationName} applied successfully`);
    }

    console.log('✅ Schema initialized successfully!');
    console.log('📊 Verifying tables...');

    // Verify tables exist
    const tables = await pglite.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log(`✅ Found ${tables.rows.length} tables:`);
    tables.rows.forEach(row => console.log(`   - ${row.tablename}`));

  } catch (error) {
    console.error('❌ Failed to initialize schema:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

initSchema()
  .then(() => {
    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  });
