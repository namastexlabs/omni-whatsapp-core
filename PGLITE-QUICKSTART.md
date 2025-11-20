# PGLite Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Configure Environment

Edit your `.env` file:

```bash
# Set database provider to PGLite
DATABASE_PROVIDER=pglite

# Choose storage mode:
# Option A: In-memory (fast, ephemeral - for testing)
PGLITE_DATA_DIR=memory://

# Option B: File-based (persistent - for desktop/production)
# PGLITE_DATA_DIR=./data/pglite
```

### 2. Generate Prisma Client & Apply Migrations

```bash
npm run db:pglite:generate  # Generate Prisma client
npm run db:pglite:deploy    # Apply all PostgreSQL migrations
```

### 3. Start Evolution API

```bash
npm start
```

That's it! 🎉

---

## 📍 Where is My Database?

### In-Memory Mode
```bash
PGLITE_DATA_DIR=memory://
```
**Location:** RAM (nowhere on disk)
**Persistence:** ❌ Data lost on restart
**Speed:** ⚡ Fastest
**Use for:** Testing, CI/CD, development

### File-Based Mode
```bash
PGLITE_DATA_DIR=./data/pglite
```
**Location:** `<project-root>/data/pglite/`
**Persistence:** ✅ Data survives restarts
**Speed:** 🚀 Fast
**Use for:** Desktop apps, local deployments

**Directory Structure Created:**
```
./data/pglite/
├── base/          # Database tables and indexes
├── pg_wal/        # Write-Ahead Log
├── global/        # Global objects
└── ...
```

### Custom Path Examples

**System Directory:**
```bash
PGLITE_DATA_DIR=/var/lib/evolution/database
```
→ Database at: `/var/lib/evolution/database/`

**User Home Directory:**
```bash
PGLITE_DATA_DIR=~/.evolution-api/db
```
→ Database at: `/home/username/.evolution-api/db/`

**Windows:**
```bash
PGLITE_DATA_DIR=C:/Evolution/database
```
→ Database at: `C:/Evolution/database/`

---

## 🔍 Inspect Your Database

Open Prisma Studio (database GUI):

```bash
npm run db:pglite:studio
```

Opens at: http://localhost:5555

---

## 📦 Database Backup & Migration

### Backup File-Based Database

Simply copy the directory:

```bash
# Backup
cp -r ./data/pglite ./backups/pglite-$(date +%Y%m%d)

# Restore
cp -r ./backups/pglite-20250101 ./data/pglite
```

### Move Database to Different Location

1. Stop Evolution API
2. Move the directory:
   ```bash
   mv ./data/pglite /new/location/pglite
   ```
3. Update `.env`:
   ```bash
   PGLITE_DATA_DIR=/new/location/pglite
   ```
4. Restart Evolution API

---

## 🧪 Testing Configuration

Test PGLite is working:

```bash
node test-pglite.js
```

Expected output:
```
🎉 All tests passed!

Summary:
  • PGLite initialized correctly
  • Prisma adapter connected
  • PostgreSQL migrations applied (57 migrations)
  • CRUD operations working
  • Database type: In-Memory (or File-based)
```

---

## 🔧 Troubleshooting

### Database not persisting?

**Check:** Is `PGLITE_DATA_DIR` set to `memory://`?
**Fix:** Use file path instead:
```bash
PGLITE_DATA_DIR=./data/pglite
```

### Cannot write to directory?

**Check:** Directory permissions
**Fix:**
```bash
mkdir -p ./data/pglite
chmod 755 ./data/pglite
```

### Migrations not applied?

**Check:** Run deploy command:
```bash
npm run db:pglite:deploy
```

### Out of disk space (file-based mode)?

**Check:** Database size:
```bash
du -sh ./data/pglite
```

**Fix:** Clean old data or use in-memory mode for testing

---

## 📊 Performance Expectations

| Operation | In-Memory | File-Based |
|-----------|-----------|------------|
| Startup | ~10ms | ~20ms |
| Simple Query | <1ms | 1-3ms |
| Insert | <1ms | 2-5ms |
| Complex Query | 1-5ms | 5-10ms |

**Note:** File-based performance depends on disk speed (SSD recommended)

---

## 🔄 Switching Between Modes

### From PostgreSQL to PGLite

1. Export your data (optional):
   ```bash
   # Using PostgreSQL
   pg_dump evolution_db > backup.sql
   ```

2. Switch to PGLite:
   ```bash
   DATABASE_PROVIDER=pglite
   PGLITE_DATA_DIR=./data/pglite
   ```

3. Apply migrations:
   ```bash
   npm run db:pglite:deploy
   ```

4. Import data (if needed):
   ```bash
   # Manual import via Prisma or SQL scripts
   ```

### From PGLite to PostgreSQL

1. Update `.env`:
   ```bash
   DATABASE_PROVIDER=postgresql
   DATABASE_CONNECTION_URI='postgresql://user:pass@localhost:5432/evolution_db'
   ```

2. Apply migrations:
   ```bash
   npm run db:deploy
   ```

---

## 📚 Additional Resources

- [Full PGLite Documentation](./PGLITE.md)
- [PGLite Official Docs](https://pglite.dev)
- [Evolution API Documentation](https://doc.evolution-api.com)

---

## ⚙️ Environment Variable Reference

```bash
# Database Provider (required)
DATABASE_PROVIDER=pglite

# Database Location (optional, defaults to memory://)
PGLITE_DATA_DIR=memory://              # In-memory
PGLITE_DATA_DIR=./data/pglite          # Relative path
PGLITE_DATA_DIR=/var/lib/evolution     # Absolute path
PGLITE_DATA_DIR=~/.evolution-api/db    # User home directory
```

---

**Need help?** Check [PGLITE.md](./PGLITE.md) for detailed documentation.
