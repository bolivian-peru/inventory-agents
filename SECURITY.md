# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

**DO NOT** open a public GitHub issue for security vulnerabilities.

### How to Report

Email: security@inventoryforagents.xyz

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Updates**: Regular progress updates
- **Resolution**: We aim to resolve critical issues within 7 days

### Disclosure Policy

- We will work with you to understand and resolve the issue
- We will keep you updated on our progress
- We will publicly acknowledge your responsible disclosure (if desired)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Security Features

- AES-256-GCM encryption for OAuth tokens
- bcrypt password hashing (12 rounds)
- JWT authentication
- Rate limiting on all endpoints
- Input validation with Zod schemas
- SQL injection prevention via Drizzle ORM

## Security Best Practices

When self-hosting, ensure:
- Strong JWT secrets (32+ characters)
- Secure database passwords
- HTTPS/TLS enabled
- Regular security updates
- Firewall configuration
- Restricted database access

See [backend/SECURITY_CONFIG.md](backend/SECURITY_CONFIG.md) for detailed security configuration.
