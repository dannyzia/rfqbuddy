# RFQ Buddy

RFQ Buddy is a comprehensive Request for Quotation (RFQ) and tendering platform designed to streamline the procurement process for organizations. The platform enables organizations to create and manage RFQs, allows vendors to submit bids, and provides committees with tools to evaluate and award contracts.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

RFQ Buddy provides a complete tendering solution with the following key features:

- **Organization Management**: Support for different organization types (buyers, vendors, committees)
- **Tender Creation**: Create RFQs with multiple tender types (Open, Limited, Direct)
- **Bid Management**: Vendors can submit and manage their bids
- **Evaluation System**: Committee members can evaluate bids using customizable criteria
- **Live Tendering**: Real-time bidding capabilities
- **Document Management**: Upload and manage tender-related documents
- **Audit Trail**: Complete audit logging for compliance
- **Subscription Management**: Tiered subscription plans with quotas
- **Notifications**: Email and in-app notifications for important events

## Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **File Storage**: S3/MinIO compatible
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **Excel Export**: XLSX
- **Testing**: Jest, Supertest
- **Logging**: Winston

### Frontend

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (Svelte Query)
- **Date Handling**: date-fns
- **Validation**: Zod
- **Testing**: Vitest, Playwright
- **Build Tool**: Vite

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Deployment**: Render (backend), Vercel (frontend)

## Architecture

The application follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (SvelteKit)                 │
│                    (Routes + Components)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         API Gateway                          │
│                    (Express.js + Middleware)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Controllers                          │
│              (Request Handling & Validation)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          Services                            │
│                   (Business Logic Layer)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│              (PostgreSQL + Redis + S3/MinIO)                 │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Routes**: Define API endpoints and route requests to appropriate controllers
2. **Controllers**: Handle HTTP requests, validate input, and call services
3. **Services**: Implement business logic and interact with the data layer
4. **Database**: Store and retrieve data using PostgreSQL with Redis caching

### Key Design Patterns

- **Repository Pattern**: Services interact with database through repository abstractions
- **Middleware Pattern**: Request processing through a chain of middleware functions
- **Service Layer**: Business logic separated from HTTP handling
- **Dependency Injection**: Configuration and dependencies injected into services

## Project Structure

```
RFQ_Buddy/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Configuration files (database, redis, logger)
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware (auth, rate limiting, etc.)
│   │   ├── routes/            # API route definitions
│   │   ├── schemas/           # Zod validation schemas
│   │   ├── services/          # Business logic layer
│   │   ├── tests/             # Integration tests
│   │   └── app.ts             # Express app configuration
│   ├── migrations/            # Database migration files
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # TypeScript configuration
├── frontend/                   # Frontend SvelteKit application
│   ├── src/
│   │   ├── lib/               # Shared libraries and utilities
│   │   ├── routes/            # SvelteKit file-based routing
│   │   └── app.html           # HTML template
│   ├── static/                # Static assets
│   ├── e2e/                   # End-to-end tests (Playwright)
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Frontend dependencies
│   └── svelte.config.js       # SvelteKit configuration
├── database/                  # Database schema and scripts
├── .kilocode/                 # Kilo AI configuration
├── docker-compose.yml         # Docker services configuration
├── render.yaml                # Render deployment configuration
└── vercel.json                # Vercel deployment configuration
```

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **PostgreSQL**: v15 or higher
- **Redis**: v7 or higher
- **npm** or **yarn**: Package manager
- **Docker** and **Docker Compose** (optional, for containerized setup)

### Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd RFQ_Buddy
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

See [Environment Variables](#environment-variables) section for details.

5. **Initialize the database**

See [Database Setup](#database-setup) section for details.

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory based on `.env.example`:

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

# Email Configuration (Optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@rfqplatform.com

# S3/MinIO Configuration (Optional for development)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=rfq-documents
S3_REGION=us-east-1

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory based on `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Running the Application

### Using Docker Compose (Recommended)

The easiest way to run all services is using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5433
- Redis on port 6379
- MinIO on ports 9000 (API) and 9001 (Console)
- Backend API on port 3000
- Frontend on port 5173

### Manual Setup

#### Starting PostgreSQL and Redis

Using Docker:

```bash
docker run -d --name rfq-postgres \
  -e POSTGRES_DB=rfq_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

docker run -d --name rfq-redis \
  -p 6379:6379 \
  redis:7-alpine
```

#### Starting the Backend

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000`

#### Starting the Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Using Provided Scripts

**Windows (PowerShell)**:

```bash
.\start-backend.ps1
```

**Windows (Batch)**:

```bash
.\start-backend.bat
```

## Database Setup

### Running Migrations

The project includes migration scripts to set up the database schema:

```bash
cd backend
node run-migrations.js
```

For platform expansion migrations:

```bash
node run-platform-expansion-migrations.js
```

For fixed migrations:

```bash
node run-fixed-migrations.js
```

### Database Schema

The database uses the following main tables (American spelling convention):

- `organizations` - Organization profiles
- `users` - User accounts with roles
- `tenders` - RFQ/tender records
- `bids` - Vendor bid submissions
- `evaluations` - Committee evaluations
- `documents` - File attachments
- `audit_logs` - System audit trail
- `subscriptions` - Subscription plans
- `notifications` - User notifications

### Seeding Test Data

To populate the database with test data:

```bash
cd backend
npm run seed:test
```

For minimal test data:

```bash
npm run seed:minimal
```

## Testing

### Backend Tests

Run all backend tests:

```bash
cd backend
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

Run specific test suites:

```bash
npm test -- auth.controller.test.ts
npm test -- bid.service.test.ts
```

### Frontend Tests

Run unit tests:

```bash
cd frontend
npm test
```

Run unit tests once:

```bash
npm run test:unit
```

Run E2E tests:

```bash
npm run test:e2e
```

Run E2E tests with UI:

```bash
npm run test:e2e:ui
```

### Test Coverage

The project aims for high test coverage across:

- **Unit Tests**: Individual functions and services
- **Integration Tests**: API endpoints and database interactions
- **E2E Tests**: Complete user workflows

## Deployment

### Backend Deployment (Render)

The backend is configured for deployment on Render using `render.yaml`.

**Deploy Steps**:

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Configure environment variables
6. Deploy

### Frontend Deployment (Vercel)

The frontend is configured for deployment on Vercel using `vercel.json`.

**Deploy Steps**:

1. Connect your GitHub repository to Vercel
2. Import the project
3. Configure environment variables
4. Deploy

### Environment Variables for Production

In production, ensure you:

- Use strong, randomly generated secrets for JWT
- Enable SSL/TLS for database connections
- Use production-grade SMTP configuration
- Set up proper S3/MinIO credentials
- Configure appropriate CORS origins
- Set `NODE_ENV=production`

### Docker Deployment

Build and run containers:

```bash
docker-compose build
docker-compose up -d
```

## API Documentation

### Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-backend-url.com/api`

### Authentication

Most endpoints require authentication using JWT tokens:

```bash
Authorization: Bearer <your-jwt-token>
```

### Main API Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

#### Tenders

- `GET /api/tenders` - List all tenders
- `GET /api/tenders/:id` - Get tender details
- `POST /api/tenders` - Create a new tender
- `PUT /api/tenders/:id` - Update tender
- `DELETE /api/tenders/:id` - Delete tender

#### Bids

- `GET /api/bids` - List bids
- `GET /api/bids/:id` - Get bid details
- `POST /api/bids` - Submit a bid
- `PUT /api/bids/:id` - Update bid

#### Committees

- `GET /api/committees` - List committees
- `GET /api/committees/:id` - Get committee details
- `POST /api/committees` - Create committee

#### Evaluations

- `GET /api/evaluations` - List evaluations
- `GET /api/evaluations/:id` - Get evaluation details
- `POST /api/evaluations` - Submit evaluation

#### Documents

- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Download document
- `DELETE /api/documents/:id` - Delete document

#### Subscriptions

- `GET /api/subscriptions` - List subscription plans
- `POST /api/subscriptions/subscribe` - Subscribe to plan

### Health Check

```bash
GET /health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Rate Limiting

API endpoints are rate-limited:

- General endpoints: 100 requests per 15 minutes
- Login endpoints: 5 requests per 15 minutes

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write tests for your changes
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for functions

### Testing Requirements

- Unit tests for all new functions
- Integration tests for API endpoints
- E2E tests for user workflows
- Maintain test coverage above 80%

## License

This project is proprietary and confidential. All rights reserved.

## Support

For support and questions:

- Email: support@rfqbuddy.com
- Documentation: [QUICKSTART.md](QUICKSTART.md)
- Issues: GitHub Issues

---

**Version**: 1.0.0  
**Last Updated**: February 17, 2026
