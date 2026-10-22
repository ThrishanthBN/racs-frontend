# RACS AI frontend

Vite + React workspace for the five RACS AI personas. The UI follows the IA-07/IA-08 M3 palette and page flows, and includes demo data so the screens work before a backend is available.

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

The frontend opens at `http://localhost:5173`. The default **Demo data** mode supports the dashboards and workflows without a backend. Use the switch in the top bar to select **Live API**; Vite then proxies `/api` requests to the Spring Boot service at `http://localhost:8080`.

Copy `.env.example` to `.env.local` to configure a separate API base URL and set `VITE_WORKSPACE_ID` plus the role-specific user IDs to existing backend records before using Live API. The current Spring candidate endpoint accepts resume metadata as JSON; the intake view validates and previews local PDF/DOCX files but cannot transfer binary file contents until the backend provides a file-upload endpoint.

## UI boundaries

- Switch roles with **View as** to preview the Admin, TA, HM, HR, and Engagement navigation.
- HM AI scores and submitted recommendations are read-only; a submitted handoff cannot be reopened for editing.
- Resume intake allows up to 100 PDF/DOCX files per batch and enforces the IA-07 5 MB per-file limit.
- Demo-mode actions update the local interface. Live API errors are shown in an accessible notification and do not silently switch back to demo mode.
