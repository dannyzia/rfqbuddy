# RFQ Buddy — Project Structure

```
RFQ_Buddy - New/
├── frontend/           React + Vite app (runs on port 3000)
├── backend/            Fastify API server (runs on port 3001)
├── docs/               Architecture, coding plan, phase docs
├── imports/            PRDs, design references, raw imports
└── docker-compose.prod.yml   Production compose (backend service)
```

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env   # fill in your secrets
npm install
npm run dev            # starts on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:3000
                       # /api requests are proxied → localhost:3001
```

## Environment Variables

| Location | File | Purpose |
|---|---|---|
| `backend/` | `.env` | DB, Redis, Auth, R2, Resend |
| `frontend/` | `.env.local` | `VITE_API_URL`, `VITE_USE_MOCK` |

### Frontend `.env.local`
```
VITE_API_URL=http://localhost:3001
VITE_USE_MOCK=false
```

### Backend `.env`
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3001
R2_ENDPOINT=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=rfq-buddy-files
RESEND_API_KEY=...
FRONTEND_URL=http://localhost:3000
```
