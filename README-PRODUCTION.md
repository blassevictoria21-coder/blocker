# Email Spam Blocker - Production Ready

## Overview

A full-stack, production-ready Email Spam Blocker system with:
- ✅ Backend API (Node.js/Express)
- ✅ PostgreSQL Database
- ✅ Frontend (HTML/CSS/JS)
- ✅ Docker & Docker Compose
- ✅ User Authentication (JWT)
- ✅ Email Classification
- ✅ Statistics Dashboard

## Quick Start

### With Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/blassevictoria21-coder/blocker.git
cd blocker
git checkout production-ready

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Access application
# Frontend: http://localhost:3000
# API: http://localhost:5000
# Database: localhost:5432
```

### Local Development (Without Docker)

```bash
# Install dependencies
cd backend
npm install

cd ../frontend
npm install

# Setup database
# Create PostgreSQL database manually
psql -U postgres -c "CREATE DATABASE spam_blocker;"
psql -U postgres -d spam_blocker -f backend/migrations/init.sql

# Start backend
cd backend
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Emails
- `POST /emails/classify` - Classify an email
- `GET /emails` - Get user's emails
- `DELETE /emails/:emailId` - Delete email

### Statistics
- `GET /stats/dashboard` - Get dashboard statistics

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### Emails Table
```sql
CREATE TABLE emails (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  email_from VARCHAR(255),
  email_to VARCHAR(255),
  subject TEXT NOT NULL,
  classification VARCHAR(50),
  spam_score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Configuration

Edit `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/spam_blocker

# API
API_PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key-here

# Gmail (Optional)
GMAIL_CLIENT_ID=your-client-id
GMAIL_CLIENT_SECRET=your-client-secret
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- AWS EC2
- Heroku
- DigitalOcean
- Docker Swarm
- Kubernetes

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Performance Metrics

- Response time: < 200ms
- Email classification: < 50ms
- Database queries: Indexed
- Memory usage: < 256MB (container)

## Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Rate limiting ready

## Support & Contribution

- [Report Issues](https://github.com/blassevictoria21-coder/blocker/issues)
- [Pull Requests](https://github.com/blassevictoria21-coder/blocker/pulls)
- [Documentation](./Email%20Spam%20Blocker%20Documentation.md)

## License

MIT License - See LICENSE file for details
