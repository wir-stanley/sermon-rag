# GRII Sermon RAG

AI-powered search and Q&A system for past sermons from **Gereja Reformed Injili Indonesia (GRII)**.

Ask questions in **Indonesian or English** — the system searches through sermon archives and provides grounded answers with source citations.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- OpenAI API key

### 1. Configure Environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your OPENAI_API_KEY
```

### 2. Start Services
```bash
docker compose up -d
```

This starts:
- **PostgreSQL** (with pgvector) on port 5432
- **Backend API** (FastAPI) on port 8000
- **Frontend** (Next.js) on port 3000

### 3. Ingest Sermons

### 3. Ingest Sermons

You can safely ingest PDFs or YouTube videos directly into the vector database using the provided command-line tool. From the `backend` directory, run:

**Check DB / Ingestion Status:**
```bash
python scripts/ingest.py stats
```

**Ingest standard morning sermons (KU Indonesia):**
```bash
python scripts/ingest.py pdf --service-type morning
```

**Ingest standard afternoon sermons (KU Sore):**
```bash
python scripts/ingest.py pdf --service-type afternoon
```

**Ingest a custom directory of new PDFs:**
```bash
python scripts/ingest.py pdf --directory /absolute/path/to/pdfs
```

**Ingest YouTube videos (auto-extracts Indonesian transcripts):**
```bash
python scripts/ingest.py youtube "https://youtube.com/watch?v=VIDEO_ID"
```

### 4. Open the App
Visit [http://localhost:3000](http://localhost:3000)

## Local Development (without Docker)

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Edit with your API key
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### PostgreSQL with pgvector
```bash
docker run -d --name sermon-pg \
  -e POSTGRES_DB=sermon_rag \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Ask a question (JSON response) |
| POST | `/api/chat/stream` | Ask a question (SSE streaming) |
| POST | `/api/ingest/pdf` | Ingest sermon PDFs |
| POST | `/api/ingest/youtube` | Ingest YouTube videos |
| GET | `/api/ingest/stats` | Ingestion statistics |
| GET | `/api/ingest/sources` | List ingested sources |
| GET | `/api/health` | Health check |

## Architecture

```
Frontend (Next.js) → FastAPI Backend → PostgreSQL + pgvector
                          ↓
                    OpenAI GPT-4o (answers)
                    OpenAI Embeddings (vectors)
```

## Sermon Data

| Collection | Count | Language |
|-----------|-------|----------|
| Morning Sermons (MRI) | 231 | Indonesian |
| Afternoon Sermons (MRIS) | 139 | Indonesian |
| **Total** | **370** | — |
