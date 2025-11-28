# Evolution API - Environment Configuration

## Environment Variables

Evolution API uses a strongly-typed configuration system via `src/config/env.config.ts`. All environment variables are defined in `.env.example` and loaded from `.env` in development.

### Critical Configuration Pattern

```bash
# Copy example to start
cp .env.example .env

# CRITICAL: Set database provider before any Prisma commands
export DATABASE_PROVIDER=postgresql  # or mysql

# Then run database operations
npm run db:generate
npm run db:migrate:dev
```

## Core Environment Variables

### Server Configuration

```bash
# Server port (CRITICAL: Must be 18082 for parent integration)
SERVER_PORT=18082
# Default: 8080, but Automagik Omni expects localhost:18082

# Server URL (for webhook callbacks)
SERVER_URL=http://localhost:18082
# Production: Use public domain for external webhooks

# CORS origin
CORS_ORIGIN=*
# Production: Restrict to parent Omni domain

# API key (required)
AUTHENTICATION_API_KEY=your-global-api-key-here
# Production: Use strong random key, rotate periodically
```

### Database Configuration (CRITICAL)

```bash
# Database provider (MUST SET THIS FIRST)
DATABASE_PROVIDER=postgresql
# Options: postgresql | mysql
# Determines which Prisma schema and migrations to use

# PostgreSQL connection (current production)
DATABASE_CONNECTION_URI=postgresql://user:password@postgres.namastex.io:5432/genieos_0
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# MySQL connection (alternative)
# DATABASE_CONNECTION_URI=mysql://user:password@host:3306/database
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE

# Connection pool settings
DATABASE_CONNECTION_POOL_SIZE=10
# Default: 10 (3 base + 7 overflow)
# Increase if supporting >100 instances
```

### WhatsApp Provider Configuration

```bash
# Baileys (WhatsApp Web) configuration
BAILEYS_ENABLED=true
BAILEYS_BROWSER=Chrome
BAILEYS_VERSION=5.0.0

# Meta WhatsApp Business API (optional)
META_ENABLED=false
META_API_KEY=your-meta-api-key
META_PHONE_NUMBER_ID=your-phone-number-id

# Evolution API (custom integration, optional)
EVOLUTION_ENABLED=false
```

### Cache Configuration

```bash
# Redis cache (recommended for production)
REDIS_ENABLED=true
REDIS_URI=redis://localhost:6379
REDIS_PASSWORD=
# If disabled, falls back to node-cache (local memory)

# Cache TTL settings
CACHE_TTL=3600
# Default: 1 hour (3600 seconds)
```

### Message Queue Configuration (Optional)

```bash
# RabbitMQ
RABBITMQ_ENABLED=false
RABBITMQ_URI=amqp://user:password@localhost:5672
RABBITMQ_EXCHANGE=evolution

# Amazon SQS
SQS_ENABLED=false
SQS_ACCESS_KEY_ID=your-access-key
SQS_SECRET_ACCESS_KEY=your-secret-key
SQS_REGION=us-east-1
SQS_QUEUE_URL=https://sqs.region.amazonaws.com/account/queue

# NATS
NATS_ENABLED=false
NATS_URL=nats://localhost:4222

# Pusher
PUSHER_ENABLED=false
PUSHER_APP_ID=your-app-id
PUSHER_KEY=your-key
PUSHER_SECRET=your-secret
PUSHER_CLUSTER=mt1
```

### Storage Configuration (Optional)

```bash
# Local storage (default)
STORAGE_PROVIDER=local
STORAGE_LOCAL_PATH=./public/media

# AWS S3
# STORAGE_PROVIDER=s3
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_S3_BUCKET=your-bucket-name
# AWS_S3_REGION=us-east-1

# MinIO (S3-compatible)
# STORAGE_PROVIDER=minio
# MINIO_ENDPOINT=localhost
# MINIO_PORT=9000
# MINIO_ACCESS_KEY=minioadmin
# MINIO_SECRET_KEY=minioadmin
# MINIO_BUCKET=evolution
# MINIO_USE_SSL=false
```

### Chatbot Integration Configuration

```bash
# OpenAI (for GPT and Whisper)
OPENAI_ENABLED=false
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
# Used for: AI responses, audio transcription

# Dify (AI agent workflow)
DIFY_ENABLED=false
DIFY_API_KEY=your-dify-key
DIFY_BASE_URL=https://api.dify.ai/v1

# Typebot (visual chatbot builder)
TYPEBOT_ENABLED=false
TYPEBOT_API_URL=https://typebot.io/api

# Chatwoot (customer service platform)
CHATWOOT_ENABLED=false
CHATWOOT_ACCOUNT_ID=your-account-id
CHATWOOT_API_KEY=your-api-key
CHATWOOT_BASE_URL=https://app.chatwoot.com

# Flowise (LangChain visual builder)
FLOWISE_ENABLED=false
FLOWISE_API_URL=http://localhost:3000/api

# N8N (workflow automation)
N8N_ENABLED=false
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

### Monitoring & Observability

```bash
# Sentry (error tracking)
SENTRY_DSN=https://public@sentry.io/project-id
SENTRY_ENVIRONMENT=production
# Leave empty to disable

# Telemetry (usage analytics)
TELEMETRY_ENABLED=true
# Non-sensitive data only: instance count, message volume, etc.

# Logging level
LOG_LEVEL=info
# Options: error | warn | info | debug | trace
# Production: info or warn
# Development: debug
```

### Webhook Configuration

```bash
# Webhook delivery settings
WEBHOOK_RETRY_COUNT=3
# Number of times to retry failed webhook delivery

WEBHOOK_RETRY_DELAY=1000
# Delay between retries (milliseconds)

WEBHOOK_TIMEOUT=30000
# Webhook request timeout (milliseconds)

WEBHOOK_BASE64=true
# Encode media files as base64 in webhook payload
# Required by parent Omni integration
```

### Docker-Specific Configuration

```bash
# Docker Compose overrides
# See docker-compose.yaml for service definitions

# PostgreSQL (via Docker)
POSTGRES_USER=evolution
POSTGRES_PASSWORD=evolution_password
POSTGRES_DB=evolution
POSTGRES_PORT=5432

# Redis (via Docker)
REDIS_PORT=6379

# RabbitMQ (via Docker)
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=admin
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
```

## Environment Setup Guide

### Development Setup

```bash
# 1. Clone repository (already done - this is a submodule)
cd /home/produser/prod/automagik-omni/resources/omni-whatsapp-core

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your values
nano .env

# 5. Set database provider
export DATABASE_PROVIDER=postgresql

# 6. Generate Prisma client
npm run db:generate

# 7. Run migrations (development)
npm run db:migrate:dev

# 8. Start development server
npm run dev:server

# Server runs on http://localhost:18082
```

### Production Setup

```bash
# 1. Set production environment variables
export NODE_ENV=production
export DATABASE_PROVIDER=postgresql
export DATABASE_CONNECTION_URI=postgresql://...production-db...
export SERVER_PORT=18082
export AUTHENTICATION_API_KEY=strong-random-key
export REDIS_ENABLED=true
export REDIS_URI=redis://production-redis:6379
export SENTRY_DSN=https://...sentry-dsn...
export SENTRY_ENVIRONMENT=production

# 2. Build application
npm run build

# 3. Deploy database migrations
npm run db:deploy

# 4. Start production server
npm run start:prod

# Or use PM2 (as parent Omni does)
pm2 start dist/index.js --name evolution-api
```

### Docker Setup

```bash
# Development with Docker Compose
docker-compose -f docker-compose.dev.yaml up -d

# Production with Docker
docker-compose up -d

# Health check
curl http://localhost:18082/health
```

## Environment Validation

### Required Variables (Fail if missing)

These must be set or application will not start:

- `SERVER_PORT` (default: 8080, **but 18082 for Omni**)
- `DATABASE_PROVIDER` (postgresql or mysql)
- `DATABASE_CONNECTION_URI`
- `AUTHENTICATION_API_KEY`

### Optional Variables (Graceful degradation)

If not set, features are disabled:

- `REDIS_ENABLED=false` → Falls back to local cache
- `RABBITMQ_ENABLED=false` → No message queue
- `OPENAI_API_KEY` not set → AI features disabled
- `SENTRY_DSN` not set → No error tracking

### Validation on Startup

Evolution API validates configuration on startup:

```typescript
// src/config/env.config.ts performs validation
- Checks required variables
- Validates DATABASE_PROVIDER value
- Validates connection URIs format
- Warns about missing optional configs
- Fails fast if critical config missing
```

## Integration with Parent Project (Automagik Omni)

### Parent-Specific Requirements

**CRITICAL**: These settings must match parent's expectations:

```bash
# Port MUST be 18082 (parent calls localhost:18082)
SERVER_PORT=18082

# Webhook base64 MUST be true (parent expects base64 media)
WEBHOOK_BASE64=true

# Database MUST be same as parent or isolated
# Current: postgres.namastex.io:5432/genieos_0
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://...namastex.io...
```

### Environment Coordination

When changing Evolution API environment:

1. **Check parent impact** - Does parent's EvolutionClient depend on this setting?
2. **Test integration** - Run parent's WhatsApp flow after change
3. **Validate webhooks** - Ensure parent receives events correctly
4. **Monitor logs** - Check for errors in parent's EvolutionClient

### Parent Environment Variables

For reference, parent Omni uses:

```bash
# In parent .env
EVOLUTION_API_URL=http://localhost:18082
EVOLUTION_API_KEY=same-as-evolution-AUTHENTICATION_API_KEY
EVOLUTION_WEBHOOK_URL=http://omni:8882/webhook/evolution
```

**Keep in sync**: `AUTHENTICATION_API_KEY` in Evolution must match parent's `EVOLUTION_API_KEY`.

## Security Best Practices

### Secrets Management

```bash
# ❌ NEVER commit secrets to Git
.env           # Gitignored
.env.local     # Gitignored
.env.*.local   # Gitignored

# ✅ Use environment-specific files
.env.example           # Template (committed)
.env.development       # Dev secrets (not committed)
.env.production        # Prod secrets (not committed)

# ✅ Use secret management in production
# - AWS Secrets Manager
# - HashiCorp Vault
# - Kubernetes Secrets
# - Docker Secrets
```

### API Key Rotation

```bash
# Generate strong API keys
openssl rand -base64 32

# Rotate periodically (quarterly recommended)
# 1. Generate new key
# 2. Update .env in Evolution API
# 3. Update parent's EVOLUTION_API_KEY
# 4. Restart both services
# 5. Revoke old key
```

### Database Credentials

```bash
# Use read-only credentials when possible
# Use connection pooling to limit connections
# Rotate database passwords quarterly
# Use SSL for database connections in production
```

## Troubleshooting

### Common Issues

**Issue**: `DATABASE_PROVIDER not set`
```bash
# Solution: Export before Prisma commands
export DATABASE_PROVIDER=postgresql
npm run db:generate
```

**Issue**: `Port 18082 already in use`
```bash
# Solution: Check if Evolution already running
ps aux | grep evolution
# Or check PM2
pm2 list
```

**Issue**: `Cannot connect to database`
```bash
# Solution: Verify connection URI
psql "postgresql://user:password@host:5432/database"
# Check network accessibility
ping postgres.namastex.io
```

**Issue**: `Redis connection failed`
```bash
# Solution: Check Redis running
redis-cli ping
# Or disable Redis
REDIS_ENABLED=false
```

**Issue**: `Webhooks not received by parent`
```bash
# Solution: Check webhook URL matches parent's endpoint
# Parent expects: http://omni:8882/webhook/evolution/{instance}
# Check WEBHOOK_BASE64=true
# Check parent is listening on port 8882
```

---

**Environment Stability**: As a submodule of Automagik Omni, environment changes must be coordinated with parent project to avoid integration breakage. Always test parent integration after environment modifications.
