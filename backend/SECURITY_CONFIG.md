# 🔒 IFA API Security Configuration

**Current Protection Status: PRODUCTION-READY**

---

## ✅ Security Measures Active

### 1. **Rate Limiting (Redis-based)**

#### General API
- **Limit:** 30 requests per minute per IP
- **Window:** 60 seconds sliding window
- **Key:** IP address or authenticated user ID
- **Response:** 429 Too Many Requests

#### Auth Endpoints (Login, Me)
- **Limit:** 5 requests per minute per IP
- **Window:** 60 seconds
- **Purpose:** Prevent brute force attacks

#### Registration
- **Limit:** 3 registrations per hour per IP
- **Window:** 3600 seconds
- **Purpose:** Prevent spam account creation

### 2. **Input Validation (Zod)**
- All request bodies validated with Zod schemas
- Email format validation
- Password minimum length (8 characters)
- SQL injection prevention via Drizzle ORM

### 3. **Authentication (JWT)**
- **Algorithm:** HS256
- **Expiry:** 7 days
- **Token Storage:** Client-side (localStorage)
- **Protected Routes:** Dashboard, Agents, Products, Messaging

### 4. **Password Security**
- **Hashing:** bcrypt with 12 rounds
- **Minimum Length:** 8 characters
- **No password reuse checking:** (can be added)

### 5. **Encryption**
- **OAuth Tokens:** AES-256-GCM encryption
- **Database:** PostgreSQL with encrypted connections
- **API Keys:** Environment variables only

### 6. **CORS Policy**
- **Allowed Origins:** Configured via CORS_ORIGIN env var
- **Credentials:** Enabled for auth
- **Methods:** GET, POST, PUT, DELETE, OPTIONS

### 7. **Security Headers (Hono)**
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff

### 8. **SSL/TLS**
- **Certificate:** Let's Encrypt (auto-renewal)
- **Protocol:** TLS 1.2+
- **HTTP:** Auto-redirect to HTTPS

---

## 🛡️ Threat Protection

### DDoS Protection
- **Method:** Redis-based rate limiting
- **Escalation:** Can add Cloudflare if needed
- **Cost:** $0 (Redis already running)

### Brute Force Protection
- **Login:** 5 attempts per minute
- **Registration:** 3 per hour
- **JWT Expiry:** 7 days force re-auth

### SQL Injection
- **Prevention:** Drizzle ORM (parameterized queries)
- **Input Validation:** Zod schemas on all endpoints

### XSS Protection
- **Headers:** X-XSS-Protection enabled
- **Frontend:** React auto-escaping
- **API:** JSON responses only

### CSRF Protection
- **Method:** JWT token required in Authorization header
- **Not cookie-based:** No CSRF risk

---

## 📊 Current Rate Limits

| Endpoint | Limit | Window | Blocks |
|----------|-------|--------|--------|
| **GET /health** | No limit | - | Health checks exempt |
| **POST /auth/register** | 3 | 1 hour | Spam accounts |
| **POST /auth/login** | 5 | 1 minute | Brute force |
| **GET /auth/me** | 5 | 1 minute | Token abuse |
| **All other endpoints** | 30 | 1 minute | API abuse |

---

## 🚨 Red Flags to Monitor

### 1. Repeated 429 Errors
```bash
# Check who's hitting rate limits
pm2 logs ifa-api | grep "429"
```

**Action:** Investigate IP, potentially ban if malicious.

### 2. Failed Login Attempts
```bash
# Check for brute force patterns
pm2 logs ifa-api | grep "Login failed"
```

**Action:** Alert if same IP has >10 failed attempts.

### 3. Database Connection Spikes
```bash
# Monitor PostgreSQL connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

**Action:** If >100 connections, investigate for connection leak.

### 4. Redis Memory Usage
```bash
# Check Redis memory
redis-cli INFO memory
```

**Action:** If >500MB, clean old rate limit keys.

---

## 🔧 Adjusting Limits

### Make Stricter (If Under Attack)

Edit `/opt/ifa/backend/src/config/constants.ts`:

```typescript
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000,
  MAX_REQUESTS: 10, // Reduced from 30
  AUTH_MAX_REQUESTS: 3, // Reduced from 5
  REGISTRATION_MAX_REQUESTS: 1, // Reduced from 3
  REGISTRATION_WINDOW_MS: 60 * 60 * 1000,
};
```

Then rebuild and restart:
```bash
cd /opt/ifa/backend
npm run build
pm2 restart ifa-api
```

### Make More Permissive (If Too Strict)

```typescript
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000,
  MAX_REQUESTS: 60, // Increased from 30
  AUTH_MAX_REQUESTS: 10, // Increased from 5
  REGISTRATION_MAX_REQUESTS: 5, // Increased from 3
  REGISTRATION_WINDOW_MS: 60 * 60 * 1000,
};
```

---

## 🔥 Emergency Procedures

### Ban Abusive IP

Add to nginx config:
```bash
# Edit nginx config
nano /etc/nginx/sites-available/ifa

# Add inside server block:
deny 123.456.789.000;

# Reload nginx
nginx -t && systemctl reload nginx
```

### Block Entire Country (If Needed)

Use GeoIP blocking:
```bash
# Install GeoIP module
apt-get install libnginx-mod-http-geoip

# Configure in nginx
```

### Enable Cloudflare (Nuclear Option)

1. Point DNS to Cloudflare
2. Enable "Under Attack" mode
3. Cloudflare will challenge suspicious traffic

---

## 📈 Monitoring Setup

### 1. Set Up Alerts

Use UptimeRobot or similar:
- **URL:** https://app.inventoryforagents.xyz/health
- **Alert on:** HTTP 500, timeout, down
- **Contact:** Your email

### 2. Log Monitoring

```bash
# Watch for errors in real-time
pm2 logs ifa-api --err

# Count errors per hour
pm2 logs ifa-api --lines 10000 | grep "error" | wc -l
```

### 3. Resource Monitoring

```bash
# CPU/Memory
htop

# Disk space
df -h

# Database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('ifa'));"
```

---

## 🎯 Security Checklist for Launch

- [x] Rate limiting active
- [x] SSL certificate installed
- [x] Firewall configured (UFW)
- [x] SSH key auth (password disabled recommended)
- [x] Database password strong
- [x] JWT secret strong (32+ chars)
- [x] CORS origin configured
- [x] Error logging active
- [ ] Uptime monitoring configured (your task)
- [ ] Backup strategy (daily recommended)

---

## 💡 Future Enhancements

### Consider Adding:
1. **IP Blacklist/Whitelist** - Manual IP management
2. **2FA for Users** - Extra account security
3. **Webhook Signatures** - Verify webhook authenticity
4. **Request Size Limits** - Prevent large payload attacks
5. **GraphQL Depth Limiting** - If adding GraphQL
6. **Honeypot Endpoints** - Catch bots
7. **CAPTCHA on Registration** - If spam becomes issue

---

## 📞 Security Incident Response

### If Compromised:

1. **Immediately:**
   - Change all passwords
   - Rotate JWT secret
   - Restart API
   - Check database for unauthorized access

2. **Investigate:**
   ```bash
   # Check auth logs
   pm2 logs ifa-api | grep "auth"

   # Check database modifications
   sudo -u postgres psql ifa -c "SELECT * FROM sellers ORDER BY created_at DESC LIMIT 20;"
   ```

3. **Notify:**
   - Email affected users
   - Update security advisory

4. **Fix:**
   - Patch vulnerability
   - Increase rate limits temporarily
   - Add IP bans if needed

---

## ✅ You're Protected

Your API has **production-grade security** with:
- ✅ Multi-layered rate limiting
- ✅ Input validation
- ✅ Authentication
- ✅ Encryption
- ✅ CORS policy
- ✅ Security headers
- ✅ SSL/TLS

**Launch with confidence!** 🚀
