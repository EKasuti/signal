# Signal: AI-Powered Ad Generation

## Short Description
**Signal** is an agentic advertising platform that automates the creation of high-fidelity video ad prompts for **OpenAI Sora**. By deeply analyzing user personas (demographics, psychographics, lifestyle) and product details, Signal uses LLMs to synthesize detailed "Creative Strategies" and convert them into cinematic video prompts.

## What I Learned
- **Agentic AI Workflow**: How to chain LLM calls (Persona Generation -> Prompt Synthesis) to create complex creative outputs.
- **Type Safety**: The importance of shared schemas between Frontend (TypeScript) and Backend (Pydantic/SQLModel) to prevent data shape operational errors.
- **Deployment Complexity**: Managing environment variables and CORS policies across different production environments (Vercel & Render).

## Inspiration & Project Ideas
This "hack-a-thing" explores the concept of **Hyper-Personalized Generative Media**. It inspires a future project idea: a fully autonomous marketing agent that not only generates the ad prompts but automatically generates the video, posts it to social media, and analyzes engagement to refine its own creative strategy in a closed-loop system.

## What Didn't Work (Challenges)
- **CORS in Production**: We faced significant challenges with Cross-Origin Resource Sharing (CORS) when deploying the separate frontend (Vercel) and backend (Render), initially blocking API requests.
- **Data Relationships**: Early versions of the backend failed to properly load nested relationships (User -> Demographics), causing 500 errors in production that were hard to debug. We verified that eager loading (`selectinload`) is critical for deeply nested SQLModels.

---

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, TypeScript
- **Backend**: Python, FastAPI, SQLModel (PostgreSQL)
- **AI**: OpenAI GPT-4o (Creative Strategy)

## How to Run

### 1. Database & Backend
1.  Navigate to `backend/` and set up the environment:
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
2.  Configure `.env` with your `OPENAI_API_KEY` and database URL.
3.  Run the server:
    ```bash
    python3 main.py
    ```

### 2. Frontend
1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    npm install
    ```
2.  Run the app:
    ```bash
    npm run dev
    ```
