# Security Guidelines

## Environment Variables

### Critical Security Requirements

1. **Never commit `.env` files to version control**
   - The `.env` file is already in `.gitignore`
   - Always use `.env.example` as a template

2. **JWT Secret**
   - Minimum 32 characters
   - Use cryptographically random values
   - Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Different secrets for development, staging, and production

3. **Database Credentials**
   - Use strong passwords (minimum 16 characters)
   - Include uppercase, lowercase, numbers, and special characters
   - Rotate credentials regularly
   - Use MongoDB Atlas IP whitelist in production

4. **Razorpay Keys**
   - Use test keys (`rzp_test_`) for development
   - Use live keys (`rzp_live_`) only in production
   - Store keys in environment variables, never in code
   - Rotate keys if compromised

5. **CORS Configuration**
   - In production, set `CLIENT_URL` to your actual frontend domain
   - Support multiple origins by comma-separating URLs
   - Never use `*` (wildcard) in production

## Security Features Implemented

### 1. Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- Payment: 10 requests per hour

### 2. Helmet Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options (clickjacking protection)
- X-XSS-Protection
- X-Content-Type-Options (MIME sniffing protection)
- Referrer Policy

### 3. Input Sanitization
- NoSQL injection prevention (express-mongo-sanitize)
- XSS protection (xss-clean)
- Input validation on all endpoints

### 4. Authentication & Authorization
- JWT tokens in HttpOnly cookies
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control (RBAC)
- User blocking capability

### 5. Database Security
- Indexed fields for performance
- Mongoose schema validation
- Connection error handling

## Production Deployment Checklist

- [ ] Generate strong JWT secret (32+ characters)
- [ ] Use production MongoDB credentials
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Use Razorpay live keys
- [ ] Set `NODE_ENV=production`
- [ ] Configure production `CLIENT_URL`
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Review and test all security headers
- [ ] Perform security audit
- [ ] Set up error tracking (e.g., Sentry)

## Monitoring & Logging

### Recommended Practices
1. Log all authentication attempts
2. Monitor rate limit violations
3. Track payment transactions
4. Alert on critical errors
5. Regular security audits

### What NOT to Log
- Passwords (plain or hashed)
- JWT tokens
- Payment card details
- Razorpay secrets
- Personal identification numbers

## Incident Response

If a security breach is suspected:

1. **Immediate Actions**
   - Rotate all secrets (JWT, database, Razorpay)
   - Review access logs
   - Disable compromised accounts
   - Notify affected users

2. **Investigation**
   - Identify breach vector
   - Assess data exposure
   - Document timeline

3. **Remediation**
   - Patch vulnerabilities
   - Update security measures
   - Conduct security audit

## Contact

For security concerns, contact: security@verra.com
