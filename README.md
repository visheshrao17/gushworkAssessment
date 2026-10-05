# Call Tracker — Service Operations Management System

A full-stack field service management application built for refrigeration and HVAC service businesses. Designed to help technicians and dispatchers track jobs, manage customer communications, generate quotes, and gain AI-powered insights — all in a fast, mobile-first interface that also works beautifully on desktop.

---

## Features

- **Kanban Board** — Visualize all active jobs by stage (New → Quote → Scheduled → In Progress → Completed)
- **Today's Visits** — A focused daily view showing only today's scheduled technician visits
- **AI Priority Insights** — Powered by OpenRouter LLM, surfaces which jobs need urgent attention with actionable suggestions
- **Auto-fill from Transcript** — Paste any call transcript or customer message and AI extracts job details into the form automatically
- **Quote Management** — Draft, send, and track acceptance/rejection of quotes with revenue tracking
- **Contact Logging** — One-tap logging of calls, voicemails, texts, and emails directly from the job card
- **Dashboard / Trackers** — Full business overview with revenue stats, pipeline value, and breakdowns by stage, source, and equipment type
- **Responsive UI** — Mobile-first bottom navigation with a full sidebar layout for desktop/laptop screens

---

## Tech Stack

### Backend
- **FastAPI** (Python) — REST API with async support
- **MongoDB** — Job and contact data storage via `motor` async driver
- **OpenRouter API** — LLM integration for AI insights and transcript parsing

### Frontend
- **React** (Create React App + CRACO)
- **React Router v6** — Client-side routing with nested routes
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **Lucide React** — Icon library
- **Sonner** — Toast notifications
- **Axios** — HTTP client

---

## Project Structure

```
azbc/
├── backend/
│   ├── server.py         # FastAPI app, all API routes
│   ├── llm.py            # OpenRouter LLM client (insights + transcript parsing)
│   ├── requirements.txt  # Python dependencies
│   └── .env.example      # Environment variable template
└── frontend/
    └── src/
        ├── App.js             # Root layout, routing, sidebar/bottom nav
        ├── api.js             # Axios API client
        ├── pages/
        │   ├── CallToday.jsx  # Kanban board view
        │   ├── TodayJobs.jsx  # Today's scheduled visits
        │   ├── AllJobs.jsx    # All jobs with stage filters
        │   ├── JobDetail.jsx  # Full job detail + quote + visit management
        │   ├── AddJob.jsx     # New job form with AI transcript auto-fill
        │   └── Dashboard.jsx  # Business analytics + AI insights
        └── components/
            ├── JobCard.jsx    # Reusable job card component
            ├── QuickLog.jsx   # Contact log bottom sheet
            └── StatusPill.jsx # Stage badge component
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas)
- OpenRouter API key → [openrouter.ai](https://openrouter.ai)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy and fill in your environment variables
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=cooltrack
EMERGENT_LLM_KEY=your_openrouter_api_key_here
CORS_ORIGINS=http://localhost:3000
```

Start the backend:
```bash
uvicorn server:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install

# Set your backend URL
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
npm start
```

App runs at [http://localhost:3000](http://localhost:3000)

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/call-today` | Jobs requiring attention today |
| `GET` | `/api/jobs` | All jobs (optional `?stage=` filter) |
| `POST` | `/api/jobs` | Create a new job |
| `GET` | `/api/jobs/:id` | Get a specific job |
| `PATCH` | `/api/jobs/:id/stage` | Update job stage |
| `POST` | `/api/jobs/:id/quote` | Create/update quote |
| `POST` | `/api/jobs/:id/visit` | Schedule a visit |
| `POST` | `/api/jobs/:id/contact` | Log a contact attempt |
| `GET` | `/api/dashboard` | Stats + AI insights |
| `POST` | `/api/parse-message` | Auto-fill job from transcript |
| `POST` | `/api/seed` | Seed demo data |

---

## Screenshots

The app provides a professional, responsive interface across all screen sizes:

- **Mobile**: Bottom tab navigation, touch-friendly job cards and actions
- **Desktop**: Persistent sidebar, full Kanban board with horizontal columns, multi-column dashboard grid

---

## License

MIT
