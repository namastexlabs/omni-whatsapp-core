# Evolution API - Mission & Product Vision

## Product Overview

**Evolution API** is a production-ready REST API for WhatsApp communication, forked from the upstream EvolutionAPI project and customized as the WhatsApp channel backend for **Automagik Omni** - a multi-tenant omnichannel messaging hub.

## The Problem

Modern businesses need to integrate WhatsApp into their customer communication workflows, but face significant challenges:

- **Multiple WhatsApp providers** with different APIs (Baileys, Meta Business API, custom integrations)
- **Complex multi-tenant requirements** where each client needs isolated WhatsApp instances
- **Integration complexity** with chatbots, CRM systems, and AI platforms
- **Message queue management** for reliable async processing
- **Media handling** at scale with various storage backends
- **Real-time event streaming** to external systems

## Our Solution

Evolution API provides a **unified REST API** that:

1. **Supports multiple WhatsApp providers**:
   - Baileys (WhatsApp Web) - Open-source, QR code authentication
   - Meta Business API - Official WhatsApp Business API
   - Evolution API - Custom WhatsApp integration

2. **Multi-tenant architecture**:
   - Complete instance isolation at database level
   - Per-instance authentication and webhooks
   - Independent integration settings per tenant

3. **Extensive integrations**:
   - **Chatbots**: Typebot, Chatwoot, OpenAI, Dify, Flowise, N8N, EvoAI
   - **Event systems**: WebSocket, RabbitMQ, Amazon SQS, NATS, Pusher
   - **Storage**: AWS S3, MinIO for media files
   - **AI capabilities**: OpenAI GPT, Whisper audio transcription

4. **Production-ready**:
   - Docker deployment with graceful shutdown
   - PostgreSQL and MySQL support via Prisma ORM
   - Redis caching for performance
   - Sentry error tracking
   - Health check endpoints

## Who We Serve

### Primary User: Automagik Omni (Parent Project)

This Evolution API fork exists as a **Git submodule** within Automagik Omni (located at `/home/produser/prod/automagik-omni`).

**Integration Model**:
- Automagik Omni (Python/FastAPI on port 8882) makes HTTP requests to Evolution API (TypeScript/Express on port 18082)
- Clean API boundary with no shared database
- EvolutionClient wrapper in parent project handles:
  - Instance creation and lifecycle management
  - Message sending and receiving
  - Webhook configuration
  - QR code retrieval for authentication

**Critical Relationship**:
- This is NOT a standalone product - it's a backend service for the parent messaging hub
- API contract stability is paramount - breaking changes affect all Automagik Omni users
- Performance optimization focuses on webhook processing and message throughput

### Secondary Users: Development Team

- Maintainers customizing Evolution API for Omni-specific needs
- Developers integrating new chatbot/CRM platforms
- DevOps managing Docker deployment and database migrations

## Key Features

1. **WhatsApp Instance Management**:
   - Create/delete instances with unique names
   - QR code authentication flow
   - Automatic reconnection handling
   - Connection status monitoring

2. **Message Operations**:
   - Send text, media, location, contact messages
   - Receive messages via webhooks
   - Message status tracking (sent, delivered, read)
   - Media download and URL generation

3. **Chatbot Integration**:
   - Trigger-based message routing
   - Session state management
   - Multi-platform support (Typebot, Chatwoot, OpenAI, etc.)
   - Audio transcription via OpenAI Whisper

4. **Event Streaming**:
   - WebSocket for real-time updates
   - RabbitMQ/SQS for async processing
   - Configurable event types per instance
   - Webhook signature validation

5. **Multi-Database Support**:
   - PostgreSQL (primary, production)
   - MySQL (alternative)
   - Provider-specific schemas and migrations
   - Prisma ORM for database access

## Success Metrics

As a backend service for Automagik Omni, success is measured by:

1. **Reliability**:
   - Parent project uptime (no Evolution API failures)
   - Automatic reconnection success rate
   - Webhook delivery reliability

2. **Performance**:
   - Message roundtrip latency (receive → AI agent → send)
   - Webhook processing throughput
   - Instance creation time (QR to connected)
   - API response times (p50, p95, p99)

3. **Compatibility**:
   - Zero breaking changes to parent API contract
   - Backward compatibility with existing instances
   - Smooth database migrations

4. **Integration Quality**:
   - Parent EvolutionClient works without modifications
   - Webhook payloads match expected schema
   - Authentication model remains stable

## Current Status

**Version**: 2.3.6 (forked from upstream EvolutionAPI)
**Deployment**: Production (integrated with Automagik Omni)
**Database**: PostgreSQL at postgres.namastex.io:5432/genieos_0
**Port**: 18082 (parent accesses via localhost:18082)

**Active Development Focus**:
- Performance optimization (webhook processing, connection pooling)
- Integration maintenance (Typebot, Chatwoot, OpenAI)
- Parent compatibility (API contract stability)
- Database migration management (PostgreSQL/MySQL)

## What We Are NOT

- ❌ Not a standalone SaaS product (it's a submodule)
- ❌ Not focused on UI/frontend (parent handles that)
- ❌ Not selling directly to end users (serves parent project)
- ❌ Not prioritizing features unneeded by Automagik Omni

## Strategic Direction

**Alignment with Automagik Omni**:
- Follow parent project's multi-channel messaging vision
- Optimize for parent's use cases (AI agent conversations, multi-tenant isolation)
- Maintain upstream Evolution API compatibility for easier updates
- Document integration points for parent developers

**Technical Evolution**:
- Improve webhook processing performance (identified bottleneck)
- Enhance connection pooling and database efficiency
- Strengthen error handling and observability
- Keep dependencies updated for security

**Integration Expansion** (only if parent needs):
- Additional chatbot platforms (as Omni requires)
- New event streaming backends (if parent adopts)
- Enhanced media storage options (if scale demands)

---

**This mission aligns with**: User's emphasis on parent integration safety ("Tudo que é feito aqui precisa avaliar o impacto Se vai quebrar alguma coisa do lado de lá também")
