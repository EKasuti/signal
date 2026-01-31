# Signal

**Signal** is an AI-powered advertising platform designed to generate high-fidelity video ad prompts for **OpenAI Sora**. By deeply analyzing user personas (demographics, psychographics, lifestyle) and product details, Signal uses LLMs to craft cinematic, emotionally resonant creative strategies and video prompts.

The platform consists of a **Next.js Admin Dashboard** for managing campaigns and users, and a **FastAPI** backend that orchestrates the AI generation pipeline, backed by **PostgreSQL**.

---

## 🚀 Features

-   **Deep User Profiling**: Create detailed user personas including values, motivations, and media preferences.
-   **AI Creative Strategy**: Automatically generates a "Creative Persona" and narrative arc based on the user and product.
-   **Sora Prompt Generation**: Converts creative strategies into precise, cinematic video prompts for OpenAI Sora.
-   **Campaign Management**: Track campaign status, view generated prompts, and manage product assets.

---

## 🛠 Tech Stack

-   **Frontend**: Next.js 14, Tailwind CSS, TypeScript
-   **Backend**: Python, FastAPI, SQLModel (SQLAlchemy)
-   **Database**: PostgreSQL (Neon for Prod, Docker for Local)
-   **AI**: OpenAI GPT-4o (Creative Strategy)

---

## 📦 quick Setup (Local)

### 1. Database (Docker)
Start a local PostgreSQL instance:
```bash
docker-compose up -d
```
*Alternatively, you can use a remote Postgres URL (e.g., Neon).*

### 2. Backend (FastAPI)

1.  Navigate to the backend:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Environment Variables:
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and add your **OpenAI API Key**:
    ```ini
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ad_agentic
    OPENAI_API_KEY=sk-proj-...
    FRONTEND_URL=http://localhost:3000
    API_URL=http://127.0.0.1:8000
    ```
5.  Run the server:
    ```bash
    python3 main.py
    ```
    *Server running at [http://127.0.0.1:8000](http://127.0.0.1:8000)*

### 3. Frontend (Next.js)

1.  Navigate to the frontend:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Copy `.env.local.example` to `.env.local`:
    ```bash
    cp .env.local.example .env.local
    ```
    Ensure it points to your backend:
    ```ini
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    *App running at [http://localhost:3000](http://localhost:3000)*

---

## ☁️ Deployment Guide

### Backend (Render + Neon)
1.  **Database**: Create a project on **Neon** and copy the Connection String (`postgres://...`).
2.  **Service**: Create a new **Web Service** on **Render** connected to this repo.
3.  **Build**: Render will automatically detect the `Dockerfile` in `backend/`.
4.  **Environment Variables**:
    -   `DATABASE_URL`: (Your Neon Connection String)
    -   `OPENAI_API_KEY`: (Your OpenAI Key)
    -   `FRONTEND_URL`: (Your production frontend URL)

### Frontend (Vercel)
1.  Import the repository into **Vercel**.
2.  Set the **Root Directory** to `frontend`.
3.  **Environment Variables**:
    -   `NEXT_PUBLIC_API_URL`: (Your Render Backend URL)
