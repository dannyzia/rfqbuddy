# RFQ Buddy - Quick Start Guide

Get RFQ Buddy up and running in minutes with this quick start guide.

## Table of Contents

- [Prerequisites](#prerequisites)
- [One-Line Setup](#one-line-setup)
- [Manual Setup](#manual-setup)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Starting Services](#starting-services)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose**: v20 or higher ([Download](https://docs.docker.com/get-docker/))
- **Git**: For cloning the repository ([Download](https://git-scm.com/downloads))

### Verify Installations

```bash
node --version    # Should be v18 or higher
docker --version  # Should be v20 or higher
docker compose version
git --version
```

## One-Line Setup

The fastest way to get RFQ Buddy running is using Docker Compose:

```bash
git clone <repository-url> && cd RFQ_Buddy && docker compose up -d
```

This command will:
1. Clone the repository
2. Navigate to the project directory
3. Start all services (PostgreSQL, Redis, MinIO, Backend, Frontend)

After the command completes, wait about 30 seconds for all services to initialize, then visit:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **MinIO Console**: http://localhost:9001 (username: `minioadmin`, password: `minioadmin`)

## Manual Setup

If you prefer to run services manually or need more control, follow these steps:

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd RFQ_Buddy
```

### Step 2: Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Step 3: Start Infrastructure Services

Start PostgreSQL and Redis using Docker:

```bash
cd ..
docker compose up -d postgres redis minio
```

Or run them individually:

```bash
# PostgreSQL
docker run -d --name rfq-postgres \
  -e POSTGRES_DB=rfq_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# Redis
docker run -d --name rfq-redis \
  -p 6379:6379 \
  redis:7-alpine

# MinIO (for file storage)
docker run -d --name rfq-minio \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  -p 9000:9000 -p 9001:9001 \
  minio/minio server /data --console-address ":9001"
```

### Step 4: Set Up Environment Variables

See [Environment Setup](#environment-setup) below.

### Step 5: Initialize the Database

See [Database Setup](#database-setup) below.

### Step 6: Start the Application

See [Starting Services](#starting-services) below.

## Environment Setup

### Backend Environment Variables

Copy the example environment file and customize it:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your preferred settings. For local development, the defaults should work:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rfq_platform
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rfq_platform
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=dev_jwt_secret_key_minimum_32_characters_long
JWT_REFRESH_SECRET=dev_refresh_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:5173

# S3/MinIO Configuration
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=rfq-documents
S3_REGION=us-east-1

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables

Copy the example environment file:

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env` with your backend URL:

```env
VITE_API_URL=http://localhost:3000/api
```

### Validate Environment Variables

The backend includes a validation script to check your environment:

```bash
cd backend
node validate-env.js
```

This will report any missing or invalid environment variables.

## Database Setup

### Running Migrations

Initialize the database schema:

```bash
cd backend
node run-migrations.js
```

You should see output indicating successful migration:

```
✅ Database connected successfully
✅ Migration completed successfully
```

### Seeding Test Data (Optional)

Populate the database with test data for development:

```bash
npm run seed:minimal
```

Or for more comprehensive test data:

```bash
npm run seed:test
```

### Verify Database Connection

Test your database connection:

```bash
node test-db.js
```

## Starting Services

### Option 1: Using Provided Scripts

**Windows (PowerShell)**:

```bash
.\start-backend.ps1
```

**Windows (Batch)**:

```bash
.\start-backend.bat
```

### Option 2: Manual Start

**Start Backend**:

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000`

**Start Frontend** (in a new terminal):

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Option 3: Using Docker Compose

Start all services including backend and frontend:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

Stop all services:

```bash
docker compose down
```

## Verification

### Check Backend Health

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Check Frontend

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the RFQ Buddy application landing page.

### Test API Endpoint

```bash
curl http://localhost:3000/api
```

Expected response:

```json
{
  "message": "RFQ Tendering Platform API",
  "version": "1.0.0",
  "documentation": "/api/docs"
}
```

### Test Database Connection

```bash
cd backend
node test-db.js
```

### Test Redis Connection

```bash
node -e "const redis = require('ioredis'); const client = new redis(); client.ping().then(() => { console.log('✅ Redis connected'); client.quit(); }).catch(err => console.error('❌ Redis connection failed:', err));"
```

## Troubleshooting

### Common Issues

#### Issue: Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**: Change the port in your `.env` file or stop the conflicting process:

```bash
# Find process using port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Find process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Issue: Database Connection Failed

**Error**: `Connection refused` or `password authentication failed`

**Solution**:
1. Ensure PostgreSQL is running: `docker ps | grep postgres`
2. Check your `.env` database credentials match the Docker container
3. Verify the database port: `docker ps | grep postgres` (should show `0.0.0.0:5432->5432/tcp`)

#### Issue: Redis Connection Failed

**Error**: `Redis connection to localhost:6379 failed`

**Solution**:
1. Ensure Redis is running: `docker ps | grep redis`
2. Check the Redis port: `docker ps | grep redis` (should show `0.0.0.0:6379->6379/tcp`)
3. Test connection: `redis-cli ping` (should return `PONG`)

#### Issue: Migration Fails

**Error**: `relation already exists` or `database does not exist`

**Solution**:
1. Drop and recreate the database:
```bash
docker exec -it rfq-postgres psql -U postgres -c "DROP DATABASE IF EXISTS rfq_platform;"
docker exec -it rfq-postgres psql -U postgres -c "CREATE DATABASE rfq_platform;"
```
2. Run migrations again: `node run-migrations.js`

#### Issue: Frontend Cannot Connect to Backend

**Error**: `Network error` or `CORS error` in browser console

**Solution**:
1. Ensure backend is running: `curl http://localhost:3000/health`
2. Check `VITE_API_URL` in frontend `.env` matches backend URL
3. Verify `CORS_ORIGINS` in backend `.env` includes frontend URL

#### Issue: File Upload Fails

**Error**: `S3 connection failed` or `Bucket not found`

**Solution**:
1. Ensure MinIO is running: `docker ps | grep minio`
2. Create the bucket manually:
```bash
# Install MinIO client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
./mc alias set local http://localhost:9000 minioadmin minioadmin
./mc mb local/rfq-documents
```

#### Issue: Tests Fail

**Error**: Test suite errors or timeouts

**Solution**:
1. Ensure all services are running: `docker compose ps`
2. Check test environment variables: `cat .env.test`
3. Run tests with verbose output: `npm test -- --verbose`

### Getting Help

If you encounter issues not covered here:

1. Check the logs: `docker compose logs -f <service-name>`
2. Review the full [README.md](README.md) for detailed documentation
3. Check the backend logs in `backend/logs/` directory
4. Enable debug logging by setting `LOG_LEVEL=debug` in your `.env`

## Next Steps

Now that RFQ Buddy is running, here's what you can do next:

### Create Your First User

Register a new user through the frontend or via API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "organizationName": "Test Organization",
    "organizationType": "buyer"
  }'
```

### Explore the API

Try out different API endpoints:

```bash
# Get all tenders
curl http://localhost:3000/api/tenders

# Get subscription plans
curl http://localhost:3000/api/subscriptions

# Get tender types
curl http://localhost:3000/api/tender-types
```

### Run Tests

Run the test suite to verify everything works:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test
```

### Development

Start development with hot-reload:

```bash
# Backend (in one terminal)
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

### Learn More

- Read the full [README.md](README.md) for comprehensive documentation
- Explore the API documentation at `http://localhost:3000/api/docs`
- Check the codebase structure in `backend/src/` and `frontend/src/`

---

**Quick Reference**

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | - |
| Backend API | http://localhost:3000/api | - |
| Health Check | http://localhost:3000/health | - |
| MinIO Console | http://localhost:9001 | minioadmin/minioadmin |
| PostgreSQL | localhost:5432 | postgres/postgres |
| Redis | localhost:6379 | - |

**Useful Commands**

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Restart a specific service
docker compose restart backend

# Run migrations
cd backend && node run-migrations.js

# Seed test data
cd backend && npm run seed:minimal

# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

---

**Version**: 1.0.0  
**Last Updated**: February 17, 2026
