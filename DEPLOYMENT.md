# Email Spam Blocker - Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose installed
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/blassevictoria21-coder/blocker.git
   cd blocker
   ```

2. **Switch to production branch**
   ```bash
   git checkout production-ready
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start the system**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - Database: localhost:5432

6. **View logs**
   ```bash
   docker-compose logs -f api
   docker-compose logs -f postgres
   ```

## Production Deployment

### AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security group: Allow 80, 443, 22

2. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone and setup**
   ```bash
   git clone https://github.com/blassevictoria21-coder/blocker.git
   cd blocker
   git checkout production-ready
   cp .env.example .env
   # Edit .env with production values
   ```

5. **Start with SSL (using Nginx reverse proxy)**
   ```bash
   # Install Nginx
   sudo apt-get update
   sudo apt-get install nginx -y
   
   # Configure Nginx
   # (See nginx-production.conf below)
   
   # Start services
   docker-compose up -d
   ```

### Heroku Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-spam-blocker
   ```

2. **Add PostgreSQL add-on**
   ```bash
   heroku addons:create heroku-postgresql:standard-0
   ```

3. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git push heroku production-ready:main
   ```

### DigitalOcean App Platform

1. **Create app.yaml**
   ```yaml
   name: spam-blocker
   services:
   - name: api
     github:
       repo: blassevictoria21-coder/blocker
       branch: production-ready
     build_command: npm install
     run_command: npm start
     envs:
     - key: NODE_ENV
       value: production
   - name: frontend
     github:
       repo: blassevictoria21-coder/blocker
       branch: production-ready
     build_command: npm run build:static
   databases:
   - name: postgres
     engine: PG
     version: "15"
   ```

2. **Deploy via CLI**
   ```bash
   doctl apps create --spec app.yaml
   ```

## Database Setup

### Backup
```bash
docker-compose exec postgres pg_dump -U spam_user spam_blocker > backup.sql
```

### Restore
```bash
cat backup.sql | docker-compose exec -T postgres psql -U spam_user spam_blocker
```

## Monitoring

### Check Container Status
```bash
docker-compose ps
```

### View API Logs
```bash
docker-compose logs -f api
```

### Database Connection
```bash
docker-compose exec postgres psql -U spam_user spam_blocker
```

## Security Best Practices

1. **Change Default Credentials**
   - JWT_SECRET
   - DB_PASSWORD
   - SMTP credentials

2. **Use HTTPS**
   - Install SSL certificate (Let's Encrypt)
   - Configure Nginx reverse proxy

3. **Environment Variables**
   - Never commit .env file
   - Use secrets management (AWS Secrets Manager, Vault)

4. **Database**
   - Enable SSL connections
   - Regular backups
   - Restrict network access

5. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration
   - API key rotation

## Scaling

### Horizontal Scaling
```yaml
# docker-compose.yml
api:
  deploy:
    replicas: 3
```

### Load Balancing
- Use Nginx/HAProxy for load balancing
- Configure sticky sessions if needed

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready

# Check logs
docker-compose logs postgres
```

### API Not Starting
```bash
# Check environment variables
docker-compose exec api env | grep DATABASE_URL

# Check logs
docker-compose logs api
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Performance Optimization

1. **Database Indexing**
   - Indexes on frequently queried columns
   - Already included in migrations

2. **Caching**
   - Implement Redis for session storage
   - Cache spam patterns

3. **API Optimization**
   - Enable gzip compression
   - Pagination for large datasets

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review documentation
3. Open GitHub issue
