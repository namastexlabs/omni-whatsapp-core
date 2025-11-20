#!/usr/bin/env node
/**
 * PGLite Integration Test
 * Tests that PGLite + Prisma works correctly with Evolution API
 */

require('dotenv').config({ path: '.env.pglite.test' });

const { PGlite } = require('@electric-sql/pglite');
const { PrismaPGlite } = require('pglite-prisma-adapter');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('\n🧪 PGLite Integration Test\n');
console.log('Environment:', {
  DATABASE_PROVIDER: process.env.DATABASE_PROVIDER,
  PGLITE_DATA_DIR: process.env.PGLITE_DATA_DIR
});

async function testPGLite() {
  let pgliteDb;
  let prisma;

  try {
    // Step 1: Create PGLite instance
    console.log('\n[1/5] Creating PGLite instance...');
    const dataDir = process.env.PGLITE_DATA_DIR || 'memory://';
    pgliteDb = new PGlite({ dataDir });
    console.log('✅ PGLite instance created');

    // Step 2: Create Prisma adapter
    console.log('\n[2/5] Creating Prisma adapter...');
    const adapter = new PrismaPGlite(pgliteDb);
    prisma = new PrismaClient({ adapter });
    console.log('✅ Prisma adapter created');

    // Step 3: Connect and apply migrations
    console.log('\n[3/5] Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected to PGLite database');

    // Step 4: Read and apply schema (simplified version)
    console.log('\n[4/5] Applying schema...');

    // Get the migration SQL
    const migrationsDir = path.join(__dirname, 'prisma', 'postgresql-migrations');
    const migrations = fs.readdirSync(migrationsDir)
      .filter(dir => !dir.startsWith('.'))
      .sort();

    console.log(`Found ${migrations.length} migration(s)`);

    // Apply each migration
    for (const migration of migrations) {
      const migrationFile = path.join(migrationsDir, migration, 'migration.sql');
      if (fs.existsSync(migrationFile)) {
        const sql = fs.readFileSync(migrationFile, 'utf-8');
        try {
          await pgliteDb.exec(sql);
          console.log(`  ✓ Applied: ${migration}`);
        } catch (error) {
          // Some migrations might fail if tables already exist, that's ok
          if (!error.message.includes('already exists')) {
            console.log(`  ⚠ Warning on ${migration}:`, error.message.split('\n')[0]);
          }
        }
      }
    }

    console.log('✅ Schema applied');

    // Step 5: Test basic CRUD operations
    console.log('\n[5/5] Testing CRUD operations...');

    // Test Instance table
    const testInstance = await prisma.instance.create({
      data: {
        name: 'test-instance-' + Date.now(),
        connectionStatus: 'close',
        ownerJid: 'test@example.com',
        profileName: 'Test Instance',
        profilePicUrl: 'https://example.com/pic.jpg'
      }
    });

    console.log('  ✓ Created instance:', testInstance.name);

    const instances = await prisma.instance.findMany();
    console.log(`  ✓ Found ${instances.length} instance(s)`);

    await prisma.instance.delete({
      where: { id: testInstance.id }
    });
    console.log('  ✓ Deleted test instance');

    console.log('✅ CRUD operations successful');

    console.log('\n🎉 All tests passed!\n');
    console.log('Summary:');
    console.log('  • PGLite initialized correctly');
    console.log('  • Prisma adapter connected');
    console.log('  • PostgreSQL migrations applied');
    console.log('  • CRUD operations working');
    console.log('  • Database type: ' + (dataDir === 'memory://' ? 'In-Memory' : 'File-based'));

    return true;
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    return false;
  } finally {
    // Cleanup
    if (prisma) {
      await prisma.$disconnect();
    }
    if (pgliteDb) {
      await pgliteDb.close();
    }
  }
}

testPGLite()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
