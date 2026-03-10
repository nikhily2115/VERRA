# VERRA Deployment Guide

Complete guide for deploying the VERRA Luxury E-Commerce Platform to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All tests pass (`npm test` in backend)
- [ ] Environment variables are configured
- [ ] MongoDB Atlas cluster is set up
- [ ] Razorpay account is configured with live keys
- [ ] Domain name is registered (if applicable)
- [ ] SSL certificates are ready
- [ ] Security audit completed
- [ ] Backup strategy is in place
- [ ] Error monitoring is configured

---

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new organization (if needed)

### 2. Create a Cluster

1. Click "Build a Cluster"
2. Choose a cloud provider (AWS, GCP, or Azure)
3. Select a region close to your users
4. Choose cluster tier (M0 for free tier, M10+ for production)
5. Name your cluster (e.g., "verra-production")
6. Click "Create Cluster"

### 3. Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose authentication method (Password recommended)
4. Create username and strong password
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### 4. Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Add your current IP
4. For production: Add your server's IP or use "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For better security, whitelist specific IPs
5. Click "Confirm"

### 5. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., "verra")

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/verra?retryWrites=true&w=majority
```

### 6. Create Database and Collections

MongoDB will automatically create the database and collections when you first insert data. However, you can manually create them:

1. Click "Collections" on your cluster
2. Click "Create Database"
3. Enter database name: "verra"
4. Enter collection name: "users"
5. Click "Create"

### 7. Create Indexes

After deployment, run the index verification script:

```bash
npm run verify-indexes
```

---

## Backend Deployment

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create verra-backend
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
heroku config:set JWT_SECRET="your-strong-jwt-secret-min-32-chars"
heroku config:set RAZORPAY_KEY_ID="rzp_live_xxxxx"
heroku config:set RAZORPAY_KEY_SECRET="your-razorpay-live-secret"
heroku config:set CLIENT_URL="https://your-frontend-domain.com"
```

4. **Create Procfile**
```bash
echo "web: node server.js" > Procfile
```

5. **Deploy**
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

6. **Verify Deployment**
```bash
heroku logs --tail
heroku open
```

7. **Run Post-Deployment Scripts**
```bash
heroku run npm run verify-indexes
heroku run npm run seed  # Optional: seed initial data
```

#### Heroku Add-ons (Optional)

```bash
# Logging
heroku addons:create papertrail

# Monitoring
heroku addons:create newrelic

# Scheduler (for cron jobs)
heroku addons:create scheduler
```

---

### Option 2: DigitalOcean Deployment

#### Prerequisites
- DigitalOcean account
- SSH access to droplet

#### Steps

1. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Select plan (minimum 2GB RAM recommended)
   - Choose datacenter region
   - Add SSH key
   - Create droplet

2. **Connect to Droplet**
```bash
ssh root@your-droplet-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2**
```bash
sudo npm install -g pm2
```

5. **Clone Repository**
```bash
cd /var/www
git clone https://github.com/yourusername/verra-ecommerce.git
cd verra-ecommerce/backend
```

6. **Install Dependencies**
```bash
npm install --production
```

7. **Create Environment File**
```bash
nano .env
```

Add your production environment variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-strong-jwt-secret
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
CLIENT_URL=https://your-frontend-domain.com
```

8. **Start Application with PM2**
```bash
pm2 start server.js --name verra-backend
pm2 save
pm2 startup
```

9. **Configure Nginx as Reverse Proxy**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/verra-backend
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/verra-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Configure SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

### Option 3: AWS EC2 Deployment

Similar to DigitalOcean, but:
1. Create EC2 instance
2. Configure security groups (allow ports 80, 443, 22)
3. Follow DigitalOcean steps 2-10

---

## Frontend Deployment

### Option 1: Vercel Deployment

#### Prerequisites
- Vercel account
- Vercel CLI installed

#### Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd frontend
vercel
```

4. **Set Environment Variables**

In Vercel dashboard:
- Go to your project
- Settings → Environment Variables
- Add:
  - `REACT_APP_API_URL`: Your backend URL
  - `REACT_APP_RAZORPAY_KEY_ID`: Your Razorpay key

5. **Deploy to Production**
```bash
vercel --prod
```

---

### Option 2: Netlify Deployment

#### Steps

1. **Build Application**
```bash
cd frontend
npm run build
```

2. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

3. **Login to Netlify**
```bash
netlify login
```

4. **Deploy**
```bash
netlify deploy --prod --dir=build
```

5. **Set Environment Variables**

In Netlify dashboard:
- Site settings → Build & deploy → Environment
- Add environment variables

---

### Option 3: AWS S3 + CloudFront

#### Steps

1. **Build Application**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
   - Go to AWS S3 console
   - Create bucket with unique name
   - Enable static website hosting
   - Set bucket policy for public read access

3. **Upload Build Files**
```bash
aws s3 sync build/ s3://your-bucket-name
```

4. **Create CloudFront Distribution**
   - Go to CloudFront console
   - Create distribution
   - Set origin to S3 bucket
   - Configure SSL certificate
   - Set default root object to `index.html`

5. **Configure Error Pages**
   - Add custom error response for 404 → /index.html (for React Router)

---

## Environment Configuration

### Backend Production Environment

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/verra

# JWT
JWT_SECRET=generate-using-crypto-randomBytes-32-chars-minimum
JWT_EXPIRE=7d

# Razorpay (LIVE KEYS)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-live-secret-key

# CORS
CLIENT_URL=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Production Environment

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### Generating Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Test backend health
curl https://api.yourdomain.com/health

# Test frontend
curl https://yourdomain.com
```

### 2. Create Admin Account

```bash
# SSH into backend server or use Heroku CLI
npm run create-admin
```

### 3. Seed Initial Data (Optional)

```bash
npm run seed
```

### 4. Verify Database Indexes

```bash
npm run verify-indexes
```

### 5. Test Critical Flows

- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Add to cart and checkout
- [ ] Payment processing (use Razorpay test mode first)
- [ ] Order creation and tracking
- [ ] Vendor product management
- [ ] Admin dashboard access

### 6. Configure Domain DNS

Point your domain to your deployment:

**For Heroku:**
```
CNAME: www → your-app.herokuapp.com
```

**For Vercel:**
```
CNAME: www → cname.vercel-dns.com
```

**For Custom Server:**
```
A Record: @ → your-server-ip
CNAME: www → yourdomain.com
```

### 7. Enable HTTPS

Ensure SSL certificates are configured:
- Heroku: Automatic with custom domain
- Vercel: Automatic
- Custom server: Use Let's Encrypt (certbot)

---

## Monitoring & Maintenance

### Application Monitoring

**Recommended Tools:**
- **New Relic**: Application performance monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay and logging
- **Datadog**: Infrastructure monitoring

### Log Management

**Heroku:**
```bash
heroku logs --tail
```

**PM2:**
```bash
pm2 logs verra-backend
```

**Nginx:**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Database Backups

**MongoDB Atlas:**
1. Go to cluster
2. Click "Backup"
3. Enable continuous backup
4. Configure backup schedule

**Manual Backup:**
```bash
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)
```

### Regular Maintenance Tasks

- [ ] Monitor error logs daily
- [ ] Review performance metrics weekly
- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Review and optimize database indexes
- [ ] Monitor disk space and memory usage
- [ ] Test backup restoration process

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Symptom:** Frontend can't connect to backend

**Solution:**
- Verify `CLIENT_URL` in backend .env matches frontend domain
- Check CORS configuration in server.js
- Ensure credentials are enabled

#### 2. Database Connection Failed

**Symptom:** "MongoNetworkError" or connection timeout

**Solution:**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions
- Test connection string locally

#### 3. Payment Integration Issues

**Symptom:** Razorpay checkout not loading

**Solution:**
- Verify Razorpay keys are correct (live vs test)
- Check Razorpay script is loaded in index.html
- Verify webhook configuration
- Check browser console for errors

#### 4. JWT Token Issues

**Symptom:** "Invalid token" or "Token expired"

**Solution:**
- Verify JWT_SECRET is same across deployments
- Check token expiration time
- Clear cookies and login again
- Verify HttpOnly cookie settings

#### 5. Build Failures

**Symptom:** Deployment fails during build

**Solution:**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for environment-specific code
- Review build logs for specific errors

#### 6. High Memory Usage

**Symptom:** Application crashes or slow performance

**Solution:**
- Increase server memory allocation
- Optimize database queries
- Implement caching
- Review memory leaks in code

---

## Rollback Procedure

If deployment fails:

**Heroku:**
```bash
heroku releases
heroku rollback v123
```

**Git-based:**
```bash
git revert HEAD
git push origin main
```

**PM2:**
```bash
pm2 stop verra-backend
git checkout previous-commit
npm install
pm2 restart verra-backend
```

---

## Security Checklist

Before going live:

- [ ] All environment variables are secure
- [ ] JWT secret is strong (32+ characters)
- [ ] Database credentials are strong
- [ ] HTTPS is enabled
- [ ] CORS is configured for specific origins
- [ ] Rate limiting is active
- [ ] Input validation is working
- [ ] Security headers are set (Helmet)
- [ ] MongoDB IP whitelist is configured
- [ ] Razorpay webhook signature verification is enabled
- [ ] Error messages don't expose sensitive information
- [ ] File upload validation is in place (if applicable)

---

## Performance Optimization

### Backend

- Enable gzip compression
- Implement Redis caching
- Optimize database queries
- Use connection pooling
- Enable CDN for static assets

### Frontend

- Enable code splitting
- Lazy load images
- Minimize bundle size
- Use production build
- Enable browser caching
- Compress images

---

## Support

For deployment support:
- Email: devops@verra.com
- Documentation: https://docs.verra.com
- Community: https://community.verra.com

---

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Vercel Documentation](https://vercel.com/docs)
- [Razorpay Integration Guide](https://razorpay.com/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

**Last Updated:** January 2024
