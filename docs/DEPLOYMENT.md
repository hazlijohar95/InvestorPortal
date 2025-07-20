# Deployment Guide

## Production Deployment

### Environment Setup

1. **Environment Variables**
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   SESSION_SECRET=your-super-secure-session-secret
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   LOG_LEVEL=info
   ```

2. **Database Setup**
   ```bash
   npm run db:push
   ```

3. **Build Application**
   ```bash
   npm run build
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

### Replit Deployment

The application is optimized for Replit deployment:

1. **Fork the Repository**
   - Fork the project to your Replit account
   - The environment will automatically install dependencies

2. **Configure Environment**
   - Set `DATABASE_URL` in Secrets tab
   - Set `SESSION_SECRET` in Secrets tab
   - Database will be auto-provisioned if using Replit DB

3. **Deploy**
   - Click the "Deploy" button in Replit
   - Choose static or autoscale deployment
   - Your app will be available at `https://yourapp.replit.app`

### Security Checklist

**Before Deployment:**
- [ ] Change default passwords
- [ ] Set strong SESSION_SECRET
- [ ] Configure CORS origins
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Review security headers
- [ ] Test authentication flows
- [ ] Verify input validation
- [ ] Check for exposed secrets

**Production Configuration:**
```javascript
// Production-only settings
if (process.env.NODE_ENV === 'production') {
  // Force HTTPS
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
  
  // Secure cookies
  cookie: {
    secure: true,
    sameSite: 'strict'
  }
}
```

### Performance Optimization

**Database:**
- Use connection pooling
- Add database indexes
- Monitor query performance
- Set up read replicas if needed

**Caching:**
- Enable Redis for session storage
- Implement application-level caching
- Use CDN for static assets
- Enable gzip compression

**Monitoring:**
- Set up application monitoring
- Configure error tracking
- Monitor database performance
- Set up uptime monitoring

### Backup Strategy

**Database Backups:**
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Automated backup with retention
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL | gzip > "backup_${DATE}.sql.gz"
find . -name "backup_*.sql.gz" -mtime +7 -delete
```

**Configuration Backups:**
- Environment variables
- SSL certificates
- Application configuration
- Deployment scripts

### Scaling Considerations

**Horizontal Scaling:**
- Load balancer configuration
- Session store (Redis/PostgreSQL)
- Database connection limits
- Shared file storage

**Vertical Scaling:**
- CPU and memory requirements
- Database instance sizing
- Connection pool limits
- Cache memory allocation

### CI/CD Pipeline

**GitHub Actions:**
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    - run: npm ci
    - run: npm test
    - run: npm run build
    - name: Deploy to production
      run: |
        # Your deployment commands here
```

### Health Checks

**Application Health:**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});
```

**Database Health:**
```javascript
app.get('/api/health', async (req, res) => {
  try {
    await db.select().from(users).limit(1);
    res.json({ database: 'healthy' });
  } catch (error) {
    res.status(503).json({ database: 'unhealthy' });
  }
});
```

### Monitoring and Logging

**Application Monitoring:**
- Response time monitoring
- Error rate tracking
- Database query monitoring
- Memory and CPU usage

**Log Aggregation:**
```javascript
// Structured logging for production
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Disaster Recovery

**Recovery Plan:**
1. Database restoration from backups
2. Application deployment rollback
3. DNS failover configuration
4. Communication plan for stakeholders

**Recovery Testing:**
- Regular backup restoration tests
- Failover procedure testing
- Recovery time measurement
- Documentation updates

### Security Updates

**Regular Maintenance:**
```bash
# Security updates
npm audit fix
npm update

# Dependency vulnerability scan
npm audit --audit-level high
```

**Security Monitoring:**
- Automated vulnerability scanning
- Security patch management
- Access log monitoring
- Intrusion detection

### SSL/TLS Configuration

**Certificate Management:**
```nginx
# Nginx configuration
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### Database Migrations

**Migration Strategy:**
```bash
# Production migration process
1. Backup current database
2. Run migrations in maintenance mode
3. Test application functionality
4. Switch traffic to new version
5. Monitor for issues
```

**Zero-Downtime Migrations:**
- Backward compatible schema changes
- Feature flags for new functionality
- Gradual rollout strategy
- Rollback procedures

### Troubleshooting

**Common Production Issues:**
- Memory leaks
- Database connection exhaustion
- SSL certificate expiration
- Disk space issues
- High CPU usage

**Diagnostic Commands:**
```bash
# Process monitoring
ps aux | grep node
top -p $(pgrep node)

# Database connections
netstat -an | grep :5432

# Disk usage
df -h
du -sh /var/log
```

### Support and Maintenance

**Support Channels:**
- Production error alerts
- User support tickets
- Performance monitoring alerts
- Security incident response

**Maintenance Windows:**
- Scheduled monthly maintenance
- Emergency patch procedures
- User communication plan
- Rollback procedures