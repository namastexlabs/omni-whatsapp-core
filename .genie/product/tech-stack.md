# Evolution API - Technical Stack

## Core Technologies

### Runtime & Language
- **Node.js 20+** - JavaScript runtime environment
- **TypeScript 5.7+** - Type-safe JavaScript with strict mode
- **tsx** - TypeScript execution and watch mode for development
- **tsup** - Fast TypeScript bundler for production builds

### Web Framework
- **Express.js 4.21.2** - HTTP server and routing
- **RouterBroker Pattern** - Custom routing abstraction with validation
- **JSONSchema7** - Request/response validation (not class-validator)
- **Guards System** - Authentication and authorization middleware

### WhatsApp Providers
- **Baileys 7.0.0-rc.6** - WhatsApp Web protocol client (open-source)
- **Meta WhatsApp Business API** - Official WhatsApp Business API integration
- **Evolution API** - Custom WhatsApp integration layer
- **QR Code** - QR code generation for Baileys authentication

### Database & ORM
- **Prisma 6.19.0** - Next-generation TypeScript ORM
- **PostgreSQL** - Primary database (production at namastex.io:5432/genieos_0)
- **MySQL** - Alternative database support
- **Provider-specific schemas** - Separate Prisma schema files per database
- **Provider-specific migrations** - Isolated migration folders (postgresql-migrations/, mysql-migrations/)

**Multi-Database Strategy**:
```bash
# Environment determines active database
export DATABASE_PROVIDER=postgresql  # or mysql

# Prisma CLI auto-selects schema and migrations
npm run db:generate  # Uses $DATABASE_PROVIDER
npm run db:migrate:dev  # Deploys to correct provider
```

### Caching
- **Redis** - Primary distributed cache (optional but recommended)
- **Node-cache** - Fallback local cache when Redis unavailable
- **TTL-based expiration** - Automatic cache invalidation
- **Connection pooling** - Redis client connection management

### Message Queue & Events
- **EventEmitter2** - Internal application events
- **WebSocket (Socket.io)** - Real-time bidirectional communication
- **RabbitMQ** - Message queue for async processing (optional)
- **Amazon SQS** - Cloud message queuing (optional)
- **NATS** - High-performance messaging system (optional)
- **Pusher** - Real-time push notifications (optional)

### Chatbot & AI Integrations
- **OpenAI** - GPT models and Whisper audio transcription
- **Dify** - AI agent workflow platform
- **Typebot** - Visual chatbot flow builder
- **Chatwoot** - Customer service platform
- **Flowise** - LangChain visual builder
- **N8N** - Workflow automation platform
- **EvoAI** - Custom AI integration
- **EvolutionBot** - Native chatbot with trigger system

### Storage
- **AWS S3** - Cloud object storage for media files
- **MinIO** - Self-hosted S3-compatible storage
- **Local filesystem** - Development and small deployments
- **Media URL generation** - Public URLs for uploaded media

### Code Quality & Tooling
- **ESLint** - Linting with auto-fix (`npm run lint`)
- **Prettier** - Code formatting (integrated with ESLint)
- **commitlint** - Conventional commits enforcement
- **Commitizen** - Interactive commit tool (`npm run commit`)
- **simple-import-sort** - Auto-sorted imports

### Deployment & DevOps
- **Docker** - Containerization (Dockerfile + docker-compose.yaml)
- **PM2** - Process manager (parent Omni uses PM2 for this service)
- **Graceful shutdown** - Proper connection cleanup on SIGTERM/SIGINT
- **Health checks** - `/health` endpoint for monitoring

### Monitoring & Observability
- **Pino** - Structured JSON logging with correlation IDs
- **Sentry** - Error tracking and performance monitoring
- **Telemetry** - Usage analytics (non-sensitive data only)
- **Logger middleware** - HTTP request/response logging

### Testing
- **Manual testing** - Primary approach (no formal test suite currently)
- **test/ directory** - For future test files (`*.test.ts`)
- **npm test** - Watch mode for test development

### Development Tools
```bash
# Development
npm run dev:server     # Hot reload with tsx watch
npm start              # Direct execution with tsx

# Production
npm run build          # TypeScript check + tsup build
npm run start:prod     # Run production build

# Code Quality
npm run lint           # ESLint with auto-fix
npm run lint:check     # ESLint check only
npm run commit         # Interactive conventional commit

# Database
export DATABASE_PROVIDER=postgresql
npm run db:generate           # Generate Prisma client
npm run db:migrate:dev        # Dev migrations with sync
npm run db:deploy             # Production deployment
npm run db:studio             # Open Prisma Studio
```

## Architecture Patterns

### Service Layer Pattern
Business logic lives in service classes, not controllers:
```typescript
export class MessageService {
  constructor(private readonly waMonitor: WAMonitoringService) {}
  private readonly logger = new Logger('MessageService');

  public async sendText(instance: InstanceDto, data: TextMessageDto) {
    const waInstance = this.waMonitor.waInstances[instance.instanceName];
    return await waInstance.sendMessage(data);
  }
}
```

### Controller Pattern (Thin Layer)
Controllers delegate to services:
```typescript
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  public async sendText(instance: InstanceDto, data: TextMessageDto) {
    return this.messageService.sendText(instance, data);
  }
}
```

### RouterBroker Pattern
Routes with built-in validation:
```typescript
export class MessageRouter extends RouterBroker {
  constructor(...guards: any[]) {
    super();
    this.router.post(this.routerPath('sendText'), ...guards, async (req, res) => {
      const response = await this.dataValidate<TextMessageDto>({
        request: req,
        schema: textMessageSchema, // JSONSchema7
        ClassRef: TextMessageDto,
        execute: (instance, data) => controller.sendText(instance, data),
      });
      res.status(200).json(response);
    });
  }
}
```

### Repository Pattern
Database access via Prisma repositories:
```typescript
const instance = await this.prismaRepository.instance.findUnique({
  where: { name: instanceName },
});
```

### Multi-Tenant Isolation
Every operation scoped by instance:
```typescript
// CRITICAL: Always include instanceId in queries
await this.prismaRepository.message.findMany({
  where: { instanceId: instance.id },
});
```

## Directory Structure

```
omni-whatsapp-core/
├── src/
│   ├── api/
│   │   ├── controllers/        # HTTP handlers (thin layer)
│   │   ├── services/           # Business logic (core)
│   │   ├── repository/         # Database access (Prisma)
│   │   ├── dto/                # Data Transfer Objects (simple classes)
│   │   ├── guards/             # Auth/authz middleware
│   │   ├── integrations/
│   │   │   ├── channel/        # WhatsApp providers
│   │   │   ├── chatbot/        # AI/Bot integrations
│   │   │   ├── event/          # Event systems
│   │   │   └── storage/        # File storage
│   │   ├── routes/             # Express route definitions
│   │   └── types/              # TypeScript types
│   ├── config/                 # Environment config
│   ├── cache/                  # Redis + local cache
│   ├── exceptions/             # Custom HTTP exceptions
│   ├── utils/                  # Shared utilities
│   └── validate/               # JSONSchema7 validation
├── prisma/
│   ├── postgresql-schema.prisma
│   ├── mysql-schema.prisma
│   ├── postgresql-migrations/
│   └── mysql-migrations/
├── public/                     # Static assets + media
├── dist/                       # Build output (generated)
├── test/                       # Test files (minimal coverage)
└── .genie/                     # Genie framework
    ├── product/                # Product docs (this file)
    ├── code/                   # Code collective agents
    ├── state/                  # Runtime state
    └── CONTEXT.md              # User preferences + integration awareness
```

## Integration with Parent Project (Automagik Omni)

### Network Architecture
```
Automagik Omni (Python FastAPI)
  Port: 8882
  ↓ HTTP calls to localhost:18082
Evolution API (TypeScript Express)
  Port: 18082
  ↓ WhatsApp Web / Business API
WhatsApp Servers
```

### API Contract (CRITICAL - DO NOT BREAK)
Parent's `EvolutionClient` depends on these endpoints:
- `POST /instance/create` - Create WhatsApp instance
- `GET /instance/fetchInstances` - List all instances
- `GET /instance/connect/{name}` - Get QR code
- `POST /webhook/set/{name}` - Configure webhooks
- `DELETE /instance/delete/{name}` - Delete instance
- `POST /message/sendText/{name}` - Send text message
- `POST /message/sendMedia/{name}` - Send media message

**Authentication**: Global `apikey` header + per-instance tokens

**Webhooks**: Parent receives `POST http://omni:8882/webhook/evolution/{instance}`
- Event: `MESSAGES_UPSERT` (new message received)
- Format: JSON with base64-encoded media (when webhook_base64=true)

### Performance Considerations
- **Webhook latency**: Parent expects < 100ms processing time
- **Connection pooling**: Currently no HTTP client pooling (opportunity)
- **Database pool**: 3 base + 7 overflow = 10 max connections
- **Synchronous webhook processing**: No queue/buffer (bottleneck identified)

## Code Standards

### Naming Conventions
- Classes: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.type.ts` (e.g., `message.service.ts`)

### File Structure
- **Service files**: `feature.service.ts` (e.g., `whatsapp.baileys.service.ts`)
- **Controller files**: `feature.controller.ts`
- **DTO files**: `feature.dto.ts`
- **Schema files**: `feature.schema.ts` (JSONSchema7)
- **Type files**: `feature.types.ts`

### Import Ordering (auto-sorted)
1. Node.js built-ins (`fs`, `path`, etc.)
2. External packages (`express`, `prisma`, etc.)
3. Internal absolute imports (`@/api/...`)
4. Internal relative imports (`./`, `../`)

### TypeScript Standards
- **Strict mode enabled** - Full type coverage required
- **No `any`** - Use proper types or `unknown`
- **Explicit return types** - All public methods must declare return type
- **Interface over type** - Prefer interfaces for object shapes

### Validation Pattern
**Use JSONSchema7, NOT class-validator decorators**:
```typescript
// CORRECT ✅
export class TextMessageDto {
  text: string;
  number: string;
}

export const textMessageSchema: JSONSchema7 = {
  $id: v4(),
  type: 'object',
  properties: {
    text: { type: 'string' },
    number: { type: 'string' },
  },
  required: ['text', 'number'],
};

// INCORRECT ❌
export class BadTextMessageDto {
  @IsString()  // Don't use decorators
  text: string;
}
```

## Security Considerations

### Authentication
- Global API key via `AUTHENTICATION_API_KEY` env var
- Per-instance tokens for WhatsApp operations
- Guards middleware for route protection
- Rate limiting on all endpoints

### Input Validation
- JSONSchema7 for all request bodies
- RouterBroker `dataValidate` enforces schemas
- SQL injection protected by Prisma (parameterized queries)
- XSS protection via proper content-type headers

### Webhook Security
- Signature validation for external webhooks
- HTTPS recommended for production webhooks
- Configurable webhook URLs per instance

## Performance Optimization Opportunities

Based on oettam's analysis and user's "always measure" preference:

### Identified Bottlenecks
1. **Synchronous webhook processing** - No async queue
2. **No HTTP connection pooling** - Each request creates new connection to parent
3. **Small database connection pool** - 10 max for 100+ instances
4. **No request batching** - Serial HTTP calls to Evolution API

### Baseline Metrics to Establish
- Message roundtrip latency (webhook received → AI agent → response sent)
- Webhook processing throughput (messages/second)
- Instance creation time (create → QR ready → connected)
- Database query latencies (p50, p95, p99)
- HTTP API response times per endpoint

### Optimization Strategy
1. **Measure first** - Establish baseline before optimization
2. **Profile** - Use clinic.js / 0x to find actual bottlenecks
3. **Optimize** - Address proven bottlenecks, not speculation
4. **Validate** - Measure improvement, ensure no regressions

---

**Stack Stability**: User preference for "always verify parent impact" means any dependency upgrades must be tested against Automagik Omni integration before deployment.
