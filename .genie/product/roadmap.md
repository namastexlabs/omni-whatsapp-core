# Evolution API - Development Roadmap

## Roadmap Philosophy

As a backend service for Automagik Omni, this roadmap prioritizes:
1. **Parent compatibility** - API contract stability over new features
2. **Performance** - User requirement: "always measure baseline before optimizations"
3. **Integration safety** - User requirement: "always verify parent impact"
4. **Upstream alignment** - Track Evolution API 2.3.x updates for security/features

## Phase 0: Foundation (COMPLETED)

**Status**: ✅ Production deployment as Automagik Omni submodule

### Completed Work
- ✅ Forked Evolution API 2.3.6 from upstream
- ✅ Integrated as Git submodule in Automagik Omni
- ✅ Configured for namastex.io PostgreSQL database (genieos_0)
- ✅ Custom port 18082 for parent HTTP integration
- ✅ Baileys 7.0 WhatsApp Web integration
- ✅ Multi-tenant instance isolation
- ✅ Webhook system for parent communication
- ✅ Chatbot integrations (Typebot, Chatwoot, OpenAI, Dify)
- ✅ Event streaming (WebSocket, RabbitMQ, SQS)
- ✅ Media storage (S3, MinIO)
- ✅ Docker deployment configuration
- ✅ PM2 process management via parent
- ✅ Prisma multi-database support (PostgreSQL/MySQL)

### Technical Debt Inherited
- 🔴 No performance benchmarks established
- 🔴 Synchronous webhook processing (no queue)
- 🔴 No HTTP connection pooling to parent
- 🔴 Small database connection pool (10 max)
- 🔴 No formal test suite
- 🟡 Manual testing only
- 🟡 No integration tests with parent

## Phase 1: Observability & Performance Baseline (CURRENT PRIORITY)

**Goal**: Establish measurement infrastructure before optimization (user requirement)

**Duration**: 2-3 weeks
**Owner**: Development team
**User Requirement**: "Sim, sempre medir" (Yes, always measure)

### 1.1 Performance Baseline Establishment

**Metrics to capture:**
- [ ] Message roundtrip latency (webhook received → AI agent → response sent)
  - Target: Measure p50, p95, p99 under normal load
  - Tool: Custom instrumentation + Prometheus/Grafana

- [ ] Webhook processing throughput (messages/second)
  - Target: Establish max throughput before queue saturation
  - Tool: Load testing with autocannon/wrk

- [ ] Instance creation time (create → QR ready → connected)
  - Target: Measure typical and worst-case timing
  - Tool: Timing logs + monitoring dashboard

- [ ] Database query latencies
  - Target: Profile all Prisma queries, identify slow queries
  - Tool: Prisma query logging + analysis

- [ ] HTTP API response times per endpoint
  - Target: p50/p95/p99 for all Evolution API endpoints
  - Tool: Express middleware timing

**Deliverables:**
- Performance dashboard (Grafana or similar)
- Baseline metrics documentation
- Bottleneck identification report

### 1.2 Integration Safety Testing

**Parent compatibility validation:**
- [ ] Document all API endpoints parent depends on
  - List in `.genie/CONTEXT.md` (already done)
  - Create API contract test suite

- [ ] Create integration smoke tests
  - Test parent's EvolutionClient can create instance
  - Test webhook delivery to parent
  - Test message send/receive flow

- [ ] Establish regression testing protocol
  - Before any API change, run integration tests
  - Validate webhook payload schemas
  - Check for breaking changes

**Deliverables:**
- Integration test suite (can be manual checklist initially)
- API contract documentation
- Change validation protocol

### 1.3 Monitoring & Observability

**Instrumentation:**
- [ ] Structured logging with correlation IDs
  - Already using Pino - enhance with request tracing

- [ ] Error tracking improvements
  - Sentry already configured - add context
  - Categorize errors (client vs server, transient vs permanent)

- [ ] Health check enhancements
  - Check database connectivity
  - Check Redis connectivity (if enabled)
  - Check WhatsApp provider status

- [ ] Telemetry improvements
  - Track instance count, active connections
  - Monitor webhook delivery success rate
  - Monitor parent integration health

**Deliverables:**
- Enhanced health check endpoint
- Monitoring dashboard
- Alert configuration

**Success Criteria:**
- ✅ Performance baseline documented with numbers
- ✅ Integration tests exist and pass
- ✅ Monitoring dashboard shows real-time metrics
- ✅ Team can identify bottlenecks from data

## Phase 2: Performance Optimization (NEXT)

**Goal**: Address identified bottlenecks based on Phase 1 data

**Duration**: 3-4 weeks
**Prerequisites**: Phase 1 baseline established
**User Requirement**: "Sim, sempre verificar" (Yes, always verify parent impact)

### 2.1 Webhook Processing Optimization

**Current Issue** (from oettam's analysis):
- Synchronous webhook handling
- No queue/buffer for burst traffic
- Blocks event loop during processing

**Proposed Solutions** (validate with benchmarks first):
- [ ] Implement webhook queue (Bull/BullMQ with Redis)
- [ ] Async webhook processing with worker threads
- [ ] Rate limiting and backpressure handling
- [ ] Batch processing for high-volume webhooks

**Validation:**
- Measure throughput before/after
- Target: 10x improvement in burst handling
- Ensure no message loss during high load
- Verify parent receives webhooks reliably

### 2.2 Connection Pooling

**Current Issue**:
- No HTTP client connection pooling
- Each parent request creates new connection
- Database pool too small (10 max for 100+ instances)

**Proposed Solutions**:
- [ ] Implement HTTP client connection pooling
  - Use httpx or axios with persistent connections
  - Configure keep-alive and connection limits

- [ ] Increase database connection pool
  - Profile actual connection usage
  - Scale pool based on instance count
  - Monitor pool saturation

**Validation:**
- Measure API latency before/after
- Target: 20-30% latency reduction
- Monitor connection pool usage
- Ensure no connection exhaustion

### 2.3 Query Optimization

**Based on profiling from Phase 1:**
- [ ] Identify slow Prisma queries
- [ ] Add database indexes where needed
- [ ] Optimize N+1 query patterns
- [ ] Implement query result caching (Redis)

**Validation:**
- Measure query latencies before/after
- Target: p99 < 100ms for all queries
- Monitor cache hit rate
- Verify data consistency

**Success Criteria:**
- ✅ Webhook throughput increased (measured improvement)
- ✅ API latency reduced (measured improvement)
- ✅ Database queries optimized (measured improvement)
- ✅ No regressions in parent integration (tests pass)
- ✅ Performance dashboard shows improvements

## Phase 3: Code Quality & Testing (PARALLEL WITH PHASE 2)

**Goal**: Improve maintainability and catch regressions early

**Duration**: Ongoing
**Owner**: Development team

### 3.1 Test Suite Development

**Current State**: Manual testing only, no formal tests

**Plan:**
- [ ] Set up testing framework (Jest or Vitest)
- [ ] Write integration tests for API endpoints
- [ ] Write unit tests for critical business logic
- [ ] Mock WhatsApp providers for testing
- [ ] Create test database fixtures

**Priority Test Coverage:**
1. API contract tests (parent integration endpoints)
2. Multi-tenant isolation tests (data leakage prevention)
3. Webhook delivery tests
4. Message send/receive flows
5. Authentication/authorization tests

**Success Criteria:**
- ✅ >60% code coverage for services
- ✅ 100% coverage for API contract endpoints
- ✅ Tests run in CI/CD pipeline
- ✅ New features require tests

### 3.2 Code Quality Improvements

**Refactoring targets:**
- [ ] Extract common validation logic
- [ ] Reduce code duplication in integrations
- [ ] Improve error handling consistency
- [ ] Document complex business logic
- [ ] Type safety improvements (remove any types)

**Standards enforcement:**
- [ ] Enable additional ESLint rules
- [ ] Add pre-commit hooks (lint + format)
- [ ] Conventional commits enforcement
- [ ] Pull request templates

**Success Criteria:**
- ✅ ESLint violations reduced to zero
- ✅ TypeScript strict mode passes
- ✅ Code review checklist in use
- ✅ Documentation updated with refactors

## Phase 4: Upstream Alignment & Security (ONGOING)

**Goal**: Stay current with Evolution API upstream for security/features

**Duration**: Ongoing maintenance
**Owner**: Development team

### 4.1 Upstream Tracking

**Process:**
- [ ] Monitor Evolution API releases (GitHub watch)
- [ ] Review changelogs for security patches
- [ ] Evaluate new features for Omni relevance
- [ ] Test upstream changes in staging environment

**Merge Strategy:**
- 🔴 **Security patches**: Merge ASAP after testing
- 🟡 **Bug fixes**: Evaluate impact, merge if beneficial
- 🟢 **New features**: Only if Omni needs them
- ⚪ **Breaking changes**: Coordinate with parent project

### 4.2 Security Maintenance

**Regular tasks:**
- [ ] Dependency updates (monthly)
- [ ] Security vulnerability scanning (npm audit)
- [ ] Penetration testing (quarterly)
- [ ] Access control review (quarterly)
- [ ] Webhook signature validation audit

**Success Criteria:**
- ✅ Zero known security vulnerabilities
- ✅ Dependencies < 6 months old
- ✅ Regular security audits completed
- ✅ Incident response plan documented

## Phase 5: Advanced Features (CONDITIONAL)

**Goal**: Add features only if Automagik Omni requires them

**Duration**: TBD
**Trigger**: Parent project feature request

### Potential Enhancements
- 🟢 **Additional chatbot platforms** (if Omni adopts)
- 🟢 **Enhanced media processing** (if scale demands)
- 🟢 **Advanced analytics** (if parent needs deeper insights)
- 🟢 **Multi-region deployment** (if geographic expansion)
- 🟢 **Horizontal scaling** (if single instance insufficient)

**Evaluation Criteria for New Features:**
1. Does Automagik Omni need this?
2. Does it break existing API contract?
3. What's the performance impact?
4. What's the maintenance burden?
5. Is upstream Evolution API already providing this?

**Decision Process:**
- Parent project requests feature
- Evaluate criteria above
- Prototype if viable
- Benchmark performance impact
- Test integration with parent
- Deploy if all validations pass

## Roadmap Principles (Guardrails)

### Always
- ✅ Measure before optimizing (user requirement)
- ✅ Verify parent impact before changes (user requirement)
- ✅ Test integration after changes
- ✅ Document API contract changes
- ✅ Maintain backward compatibility

### Never
- ❌ Break parent's API contract without coordination
- ❌ Optimize without baseline metrics
- ❌ Add features Omni doesn't need
- ❌ Merge upstream changes without testing
- ❌ Skip regression tests

### Priorities
1. **Parent compatibility** - Nothing matters if Omni breaks
2. **Performance** - User-facing latency is critical
3. **Security** - Protect multi-tenant data
4. **Maintainability** - Code quality for long-term health
5. **Features** - Only if parent needs them

## Quarterly Review

**Process:**
- Review roadmap priorities quarterly
- Adjust based on parent project feedback
- Re-evaluate performance targets
- Update based on upstream Evolution API direction

**Next Review**: TBD (establish after Phase 1 complete)

---

**This roadmap reflects**: User's emphasis on performance measurement and parent integration safety. All optimizations must be validated with data, and all changes must consider impact on Automagik Omni.
