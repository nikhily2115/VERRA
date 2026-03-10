# Monitoring and Logging Guide

This guide covers monitoring, logging, and observability for the VERRA platform.

## Logging

### Winston Logger

The application uses Winston for structured logging with the following features:

- **Log Levels**: error, warn, info, http, debug
- **Log Files**:
  - `logs/error.log` - Error level logs only
  - `logs/combined.log` - All logs
  - `logs/exceptions.log` - Uncaught exceptions
  - `logs/rejections.log` - Unhandled promise rejections
- **Log Rotation**: Automatic rotation at 5MB, keeps 5 files
- **Console Output**: Enabled in development mode

### Using the Logger

```javascript
const logger = require('./utils/logger');

// Log levels
logger.error('Error message', { error: err });
logger.warn('Warning message');
logger.info('Info message');
logger.http('HTTP request');
logger.debug('Debug message');
```

### HTTP Request Logging

Morgan middleware logs all HTTP requests:

- **Development**: Concise colored output
- **Production**: Combined Apache format to Winston

### Log Configuration

Set log level via environment variable:

```env
LOG_LEVEL=info  # Options: error, warn, info, http, debug
```

### What Gets Logged

**Automatically Logged:**
- All HTTP requests (method, URL, status, response time)
- Server startup and shutdown
- Database connection events
- Unhandled errors and rejections
- Authentication attempts (success/failure)
- Payment transactions
- Order creation

**What NOT to Log:**
- Passwords (plain or hashed)
- JWT tokens
- Payment card details
- Razorpay secrets
- Personal identification numbers

### Log Analysis

**View Recent Logs:**
```bash
tail -f logs/combined.log
```

**View Errors Only:**
```bash
tail -f logs/error.log
```

**Search Logs:**
```bash
grep "error" logs/combined.log
grep "payment" logs/combined.log | grep "failed"
```

---

## Application Monitoring

### Recommended Tools

#### 1. New Relic

**Features:**
- Application performance monitoring (APM)
- Real-time metrics
- Error tracking
- Transaction tracing
- Database query analysis

**Setup:**
```bash
npm install newrelic
```

Create `newrelic.js`:
```javascript
exports.config = {
  app_name: ['VERRA Backend'],
  license_key: 'your-license-key',
  logging: {
    level: 'info'
  }
};
```

Add to server.js:
```javascript
require('newrelic');
```

#### 2. Sentry

**Features:**
- Error tracking
- Performance monitoring
- Release tracking
- User feedback

**Setup:**
```bash
npm install @sentry/node @sentry/tracing
```

Add to server.js:
```javascript
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Add error handler before other error middleware
app.use(Sentry.Handlers.errorHandler());
```

#### 3. Datadog

**Features:**
- Infrastructure monitoring
- APM
- Log management
- Real user monitoring

**Setup:**
```bash
npm install dd-trace
```

Add to server.js:
```javascript
require('dd-trace').init({
  hostname: 'your-hostname',
  service: 'verra-backend',
  env: process.env.NODE_ENV
});
```

---

## Health Checks

### Endpoint

```
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Enhanced Health Check

Create `routes/healthRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage(),
  };
  
  res.status(200).json(health);
});

router.get('/health/ready', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ ready: false });
  }
});

router.get('/health/live', (req, res) => {
  res.status(200).json({ alive: true });
});

module.exports = router;
```

---

## Performance Monitoring

### Key Metrics to Monitor

1. **Response Time**
   - Average response time per endpoint
   - 95th and 99th percentile response times
   - Slow query detection

2. **Error Rate**
   - 4xx errors (client errors)
   - 5xx errors (server errors)
   - Error rate by endpoint

3. **Throughput**
   - Requests per second
   - Requests per minute
   - Peak traffic times

4. **Database Performance**
   - Query execution time
   - Connection pool usage
   - Slow queries

5. **Memory Usage**
   - Heap usage
   - Memory leaks
   - Garbage collection

6. **CPU Usage**
   - CPU utilization
   - Event loop lag

### Custom Metrics

Add custom metrics to track business KPIs:

```javascript
const logger = require('./utils/logger');

// Track order creation
logger.info('Order created', {
  orderId: order._id,
  amount: order.totalAmount,
  userId: order.user,
  metric: 'order_created'
});

// Track payment success
logger.info('Payment successful', {
  orderId: order._id,
  amount: order.totalAmount,
  paymentId: razorpay_payment_id,
  metric: 'payment_success'
});

// Track product approval
logger.info('Product approved', {
  productId: product._id,
  vendorId: product.vendor,
  metric: 'product_approved'
});
```

---

## Alerting

### Critical Alerts

Set up alerts for:

1. **Server Down**
   - Health check fails
   - No response from server

2. **High Error Rate**
   - 5xx errors exceed threshold
   - Database connection failures

3. **Performance Degradation**
   - Response time exceeds threshold
   - High memory usage (>80%)
   - High CPU usage (>80%)

4. **Security Issues**
   - Multiple failed login attempts
   - Rate limit violations
   - Suspicious activity patterns

5. **Business Metrics**
   - Payment failures spike
   - Order creation drops
   - User registration anomalies

### Alert Channels

- **Email**: Critical alerts
- **Slack**: All alerts
- **PagerDuty**: On-call rotation
- **SMS**: Critical production issues

---

## Database Monitoring

### MongoDB Atlas Monitoring

MongoDB Atlas provides built-in monitoring:

1. **Metrics**
   - Operations per second
   - Query execution time
   - Connection count
   - Disk usage

2. **Performance Advisor**
   - Slow query detection
   - Index recommendations
   - Schema optimization

3. **Real-time Performance Panel**
   - Current operations
   - Active connections
   - Replication lag

### Custom Database Monitoring

```javascript
const mongoose = require('mongoose');
const logger = require('./utils/logger');

// Monitor connection events
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', { error: err });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Monitor slow queries
mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.debug('MongoDB Query', {
    collection: collectionName,
    method: method,
    query: query
  });
});
```

---

## Frontend Monitoring

### Recommended Tools

1. **Google Analytics**
   - User behavior tracking
   - Page views
   - Conversion tracking

2. **LogRocket**
   - Session replay
   - Error tracking
   - Performance monitoring

3. **Sentry (Frontend)**
   - JavaScript error tracking
   - Performance monitoring
   - User feedback

### Setup LogRocket

```bash
cd frontend
npm install logrocket
```

Add to `src/index.js`:
```javascript
import LogRocket from 'logrocket';

if (process.env.NODE_ENV === 'production') {
  LogRocket.init('your-app-id');
}
```

---

## Monitoring Dashboard

### Key Metrics Dashboard

Create a dashboard to monitor:

**System Health:**
- Server uptime
- CPU usage
- Memory usage
- Disk usage

**Application Metrics:**
- Request rate
- Error rate
- Response time
- Active users

**Business Metrics:**
- Orders per hour
- Revenue per hour
- New user registrations
- Product approvals

**Database Metrics:**
- Query performance
- Connection pool
- Slow queries
- Index usage

### Tools for Dashboards

- **Grafana**: Open-source dashboards
- **Datadog**: All-in-one monitoring
- **New Relic**: APM dashboards
- **Custom**: Build with React + Chart.js

---

## Log Retention

### Retention Policy

- **Error logs**: 90 days
- **Combined logs**: 30 days
- **Exception logs**: 90 days
- **HTTP logs**: 7 days

### Log Archival

Archive old logs to S3 or similar:

```bash
# Compress and archive logs older than 30 days
find logs/ -name "*.log" -mtime +30 -exec gzip {} \;
aws s3 sync logs/ s3://your-bucket/logs/
```

---

## Incident Response

### When an Alert Fires

1. **Acknowledge**: Acknowledge the alert
2. **Assess**: Check dashboard and logs
3. **Diagnose**: Identify root cause
4. **Mitigate**: Apply immediate fix
5. **Resolve**: Implement permanent solution
6. **Document**: Write post-mortem

### Common Issues

**High Memory Usage:**
```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart verra-backend
```

**Database Connection Issues:**
```bash
# Check MongoDB Atlas status
# Verify IP whitelist
# Check connection string
# Restart application
```

**High Error Rate:**
```bash
# Check error logs
tail -f logs/error.log

# Check specific endpoint
grep "POST /api/payment" logs/combined.log | grep "500"
```

---

## Performance Optimization

### Monitoring for Optimization

Use monitoring data to identify:

1. **Slow Endpoints**
   - Optimize database queries
   - Add caching
   - Implement pagination

2. **Memory Leaks**
   - Profile memory usage
   - Fix circular references
   - Close connections properly

3. **Database Bottlenecks**
   - Add indexes
   - Optimize queries
   - Implement connection pooling

4. **High CPU Usage**
   - Optimize algorithms
   - Implement caching
   - Use worker threads

---

## Compliance and Audit

### Audit Logging

Log important actions for compliance:

```javascript
logger.info('User action', {
  action: 'user_blocked',
  adminId: req.user._id,
  targetUserId: userId,
  timestamp: new Date(),
  ip: req.ip
});
```

### GDPR Compliance

- Log user data access
- Track data modifications
- Implement data deletion logging
- Maintain audit trail

---

## Monitoring Checklist

- [ ] Winston logger configured
- [ ] Morgan HTTP logging enabled
- [ ] Error tracking set up (Sentry)
- [ ] APM configured (New Relic/Datadog)
- [ ] Health check endpoints created
- [ ] Alerts configured
- [ ] Dashboard created
- [ ] Log rotation enabled
- [ ] Database monitoring active
- [ ] Frontend monitoring set up
- [ ] Incident response plan documented
- [ ] On-call rotation established

---

## Resources

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Morgan Documentation](https://github.com/expressjs/morgan)
- [Sentry Documentation](https://docs.sentry.io/)
- [New Relic Documentation](https://docs.newrelic.com/)
- [Datadog Documentation](https://docs.datadoghq.com/)

---

**Last Updated:** January 2024
