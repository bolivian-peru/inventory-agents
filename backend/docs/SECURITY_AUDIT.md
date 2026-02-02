# IFA Backend - Security Audit Report

> **Audit Date:** 2026-02-01
> **Auditor:** Automated + Manual Review
> **Scope:** Full backend codebase

---

## Executive Summary

| Category | Status | Issues Found |
|----------|--------|--------------|
| Dependencies | ⚠️ | 4 moderate (dev-only) |
| Authentication | ✅ | 0 critical |
| Authorization | ✅ | 0 critical |
| Input Validation | ✅ | 0 critical |
| Encryption | ✅ | 0 critical |
| SQL Injection | ✅ | 1 fixed |
| XSS | ✅ | 0 (API only) |
| Secrets Management | ⚠️ | 2 recommendations |
| Rate Limiting | ✅ | 1 edge case |
| CORS | ✅ | 1 fixed |

**Overall Risk Level:** LOW (for MVP)

---

## 1. Dependency Vulnerabilities

### npm audit Results

```
4 moderate severity vulnerabilities

All in development dependencies (drizzle-kit → esbuild-kit → esbuild)
NOT included in production builds
```

| Package | Severity | Type | Production Impact |
|---------|----------|------|-------------------|
| esbuild | Moderate | Dev server MITM | None (dev only) |
| @esbuild-kit/core-utils | Moderate | Transitive | None (dev only) |
| @esbuild-kit/esm-loader | Moderate | Transitive | None (dev only) |
| drizzle-kit | Moderate | Dev tool | None (dev only) |

**Recommendation:** Safe for production. These affect development tooling only.

### Fixed Vulnerabilities

| Package | Previous | Fixed | Issue |
|---------|----------|-------|-------|
| bcrypt | 5.1.1 | 6.0.0 | tar path traversal (GHSA-34x7-hfp2-rc4v) |
| tar | 6.x | 7.x | Symlink poisoning (GHSA-8qq5-rm4j-mr97) |

---

## 2. Authentication Security

### JWT Implementation

**File:** `src/middleware/auth.ts`

| Check | Status | Notes |
|-------|--------|-------|
| Algorithm | ✅ HS256 | Symmetric, appropriate for single-server |
| Expiry | ✅ 7 days | Reasonable for low-risk app |
| Secret validation | ✅ min 32 chars | Enforced in env.ts |
| Token verification | ✅ jose library | Industry standard |
| Seller status check | ✅ | Suspended accounts rejected |

**Code Review:**
```typescript
// ✅ Proper token creation
export async function createToken(payload: { sellerId: string; email: string }): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

// ✅ Proper verification
export async function verifyToken(token: string): Promise<AuthContext> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return { sellerId: payload.sellerId as string, email: payload.email as string };
  } catch {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }
}
```

### Password Security

**File:** `src/routes/auth.ts`

| Check | Status | Notes |
|-------|--------|-------|
| Hashing | ✅ bcrypt | 12 rounds |
| Min length | ✅ 8 chars | Zod validation |
| Timing attack | ✅ | bcrypt.compare is constant-time |

---

## 3. Token Encryption

### Etsy OAuth Tokens

**File:** `src/utils/crypto.ts`

| Check | Status | Notes |
|-------|--------|-------|
| Algorithm | ✅ AES-256-GCM | Authenticated encryption |
| IV | ✅ Random 16 bytes | Per-encryption |
| Auth tag | ✅ 16 bytes | Integrity verified |
| Key handling | ⚠️ | See recommendations |

**Code Review:**
```typescript
// ✅ Proper encryption
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);  // ✅ Random IV
  const cipher = createCipheriv(ALGORITHM, key, iv);
  // ... proper GCM usage
}

// ⚠️ Key handling could be improved
function getKey(): Buffer {
  const key = env.TOKEN_ENCRYPTION_KEY;
  if (/^[0-9a-fA-F]{64}$/.test(key)) {
    return Buffer.from(key, "hex");
  }
  return Buffer.from(key.slice(0, 32));  // ⚠️ Truncation risk
}
```

**Recommendation:** Require exactly 64-char hex string for encryption key. Don't truncate.

---

## 4. SQL Injection Analysis

### Drizzle ORM (Safe)

All database queries use Drizzle ORM with parameterized queries:

```typescript
// ✅ Safe - Drizzle handles parameterization
const [seller] = await db
  .select()
  .from(sellers)
  .where(eq(sellers.email, email.toLowerCase()))
  .limit(1);
```

### Raw SQL (Fixed)

**File:** `src/workers/queue-worker.ts`

| Query | Status | Fix Applied |
|-------|--------|-------------|
| Reconcile stalled runs | ✅ Safe | No user input |
| Claim next job | ✅ Safe | No user input |
| Mark job done | ✅ Safe | Job ID from DB |
| Retry with backoff | ✅ Fixed | Was template literal |

**Before (Vulnerable):**
```typescript
// ❌ Template literal in SQL
await sql`
  UPDATE agent_inbox
  SET available_at = NOW() + INTERVAL '${backoffMs} milliseconds'
  WHERE id = ${job.id}
`;
```

**After (Fixed):**
```typescript
// ✅ Use Drizzle ORM
const availableAt = new Date(Date.now() + backoffSeconds * 1000);
await db
  .update(agentInbox)
  .set({ status: "queued", attemptCount: job.attempt_count + 1, availableAt })
  .where(eq(agentInbox.id, job.id));
```

---

## 5. Input Validation

### Zod Schemas

All API inputs validated with Zod:

| Endpoint | Schema | Status |
|----------|--------|--------|
| POST /auth/register | ✅ email, password (min 8), name |
| POST /auth/login | ✅ email, password |
| POST /agents/me/send | ✅ message (max 4000), source |
| PATCH /agents/me/soul | ✅ soulInstructions (max 10000) |
| GET /products | ✅ search, state, limit, offset |
| POST /messaging/telegram/connect | ✅ chatId |
| POST /messaging/webhook | ✅ platform, platformId, message, sender |

**Example:**
```typescript
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});
```

---

## 6. Rate Limiting

**File:** `src/middleware/rate-limiter.ts`

| Check | Status | Notes |
|-------|--------|-------|
| Algorithm | ✅ Sliding window | Redis sorted sets |
| Per-user | ✅ | By sellerId or IP |
| Auth endpoints | ✅ | Stricter limit (10/min) |
| Headers | ✅ | X-RateLimit-* exposed |

**Edge Case (Low Risk):**
```typescript
// ⚠️ Anonymous requests without IP share limit
const identifier = auth?.sellerId || c.req.header("x-forwarded-for") || "anonymous";
```

**Risk:** If X-Forwarded-For is missing (direct access), all anonymous requests share one limit.

**Mitigation:** In production, Nginx always sets X-Forwarded-For.

---

## 7. CORS Configuration

**File:** `src/app.ts`

**Fixed Issue:**
```typescript
// Before - whitespace not trimmed
origin: env.CORS_ORIGIN.split(",")

// After - proper parsing
origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
```

---

## 8. Environment Variables

### Secrets in Environment

| Variable | Type | Validation |
|----------|------|------------|
| JWT_SECRET | String | ✅ min 32 chars |
| TOKEN_ENCRYPTION_KEY | String | ✅ min 32 chars |
| DATABASE_URL | URL | ✅ URL format |
| ANTHROPIC_API_KEY | String | ✅ required |
| ETSY_API_KEY | String | ✅ required |
| ETSY_SHARED_SECRET | String | ✅ required |

### Environment Variable Exposure

| Location | Status | Notes |
|----------|--------|-------|
| MCP config | ⚠️ | Etsy tokens in .mcp.json |
| Process spawn | ⚠️ | ANTHROPIC_API_KEY in env |
| Logs | ✅ | No secrets logged |

**Recommendation:** MCP config files contain decrypted Etsy tokens. Ensure workspace directories have proper permissions (0700).

---

## 9. File System Security

### Workspace Directories

**Location:** `/root/.openclaw/workspaces/seller_{id}/`

| Check | Status | Notes |
|-------|--------|-------|
| Path traversal | ✅ | ID is validated nanoid |
| Permissions | ⚠️ | Should be 0700 |
| Cleanup | ⚠️ | No auto-cleanup on delete |

**Recommendation:** Add workspace permission setting in provisioner:
```typescript
await chmod(workspacePath, 0o700);
```

---

## 10. API Security Headers

**File:** `src/app.ts`

```typescript
app.use("*", secureHeaders());
```

Headers set by Hono's secureHeaders:
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block

**Additional headers in Nginx:**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
```

---

## 11. Error Handling

**File:** `src/middleware/error-handler.ts`

| Check | Status | Notes |
|-------|--------|-------|
| Stack traces | ✅ Hidden in production |
| Zod errors | ✅ Sanitized output |
| Logging | ✅ Errors logged with context |

```typescript
const message =
  env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message || "Internal server error";
```

---

## 12. Sensitive Data Handling

### Data at Rest

| Data | Encryption | Notes |
|------|------------|-------|
| Passwords | ✅ bcrypt | One-way hash |
| Etsy tokens | ✅ AES-256-GCM | In database |
| Products | ❌ | Not sensitive |
| Messages | ❌ | Consider encryption |

### Data in Transit

| Path | Encryption | Notes |
|------|------------|-------|
| Client → Nginx | ✅ TLS 1.3 | Via Certbot |
| Nginx → API | ❌ | Localhost only |
| API → PostgreSQL | ❌ | Localhost only |
| API → Redis | ❌ | Localhost only |

---

## 13. Logging & Audit Trail

### Current State

| Type | Logged | Notes |
|------|--------|-------|
| Auth attempts | ❌ | Should log |
| OAuth flows | ⚠️ | Errors only |
| Agent events | ✅ | In agent_events table |
| API requests | ✅ | Hono logger |

**Recommendation:** Add audit logging for:
- Login attempts (success/failure)
- Token refreshes
- Agent provisioning
- Etsy connections

---

## 14. Denial of Service Protection

| Vector | Protection | Notes |
|--------|------------|-------|
| Request flooding | ✅ Rate limit | 100/min per user |
| Large payloads | ⚠️ | No body size limit |
| Long queries | ⚠️ | No query timeout |
| Memory exhaustion | ⚠️ | Product sync loads all |

**Recommendations:**
1. Add request body size limit in Nginx
2. Add database query timeouts
3. Paginate product sync

---

## 15. Third-Party Integrations

### Etsy API

| Check | Status | Notes |
|-------|--------|-------|
| OAuth 2.0 + PKCE | ✅ | Secure flow |
| Token refresh | ✅ | Auto-refresh |
| Token storage | ✅ | Encrypted |
| API errors | ⚠️ | No rate limit handling |

### OpenClaw/Claude

| Check | Status | Notes |
|-------|--------|-------|
| Subprocess | ✅ | Isolated per user |
| API key | ⚠️ | In process env |
| Timeout | ✅ | 30 minute max |

---

## Recommendations Summary

### Immediate (P0)

1. ✅ **DONE** - Fix SQL template literal injection
2. ✅ **DONE** - Fix CORS origin parsing
3. ✅ **DONE** - Fix process.env usage
4. ✅ **DONE** - Update vulnerable dependencies

### High Priority (P1)

1. Add workspace directory permissions (0700)
2. Require exact 64-char hex for encryption key
3. Add request body size limit in Nginx
4. Add auth attempt logging

### Medium Priority (P2)

1. Add database query timeouts
2. Paginate product sync
3. Add Etsy API rate limit handling
4. Consider message encryption at rest

### Low Priority (P3)

1. Add Prometheus metrics
2. Add structured audit logging
3. Consider key rotation mechanism

---

## Compliance Notes

### GDPR Considerations

| Requirement | Status | Notes |
|-------------|--------|-------|
| Data minimization | ✅ | Only necessary data stored |
| Encryption at rest | ⚠️ | Tokens encrypted, messages not |
| Right to deletion | ⚠️ | CASCADE deletes, but workspaces remain |
| Audit trail | ⚠️ | Partial (agent_events only) |

### PCI DSS

Not applicable - no payment processing.

---

## Conclusion

The IFA backend has a solid security foundation for an MVP:

- ✅ Proper authentication with JWT
- ✅ Strong password hashing
- ✅ Token encryption at rest
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention
- ✅ Rate limiting
- ✅ Secure headers

The remaining items are enhancements rather than critical vulnerabilities. The 4 moderate npm vulnerabilities are in development tools only and don't affect production.

**Risk Assessment:** LOW - Suitable for MVP deployment with monitoring.
