# Issue Tracker

A simple full-stack Issue Tracker application built with Python (Flask) backend and Angular (TypeScript) frontend. It allows users to view, search, filter, sort, create, and update issues via REST APIs and a responsive UI.

This project fulfills the assignment requirements: Backend endpoints for CRUD operations with pagination/search/filter/sort, and frontend with table view, dialogs, and detail page.

## Features

### Backend (Flask)
- **REST APIs**: Health check, list issues (with query params), get/update/create single issue.
- **Data Handling**: In-memory storage with 3 sample issues; auto-generates UUID IDs and ISO timestamps (createdAt/updatedAt).
- **Query Support**: Pagination (`page`, `pageSize`), search (title/description), filters (status, priority, assignee), sorting (`sortBy`, `sortOrder`).
- **CORS Enabled**: Allows frontend (localhost:4200) to call backend (localhost:5000).

### Frontend (Angular 17+ with Material UI)
- **Issues List Page** (`/issues`): Material table with columns (ID, Title, Status, Priority, Assignee, UpdatedAt).
  - Search box (title/description).
  - Filters: Status dropdown (open/in-progress/closed), Priority dropdown (low/medium/high), Assignee input.
  - Sorting: Click headers (e.g., UpdatedAt desc by default).
  - Pagination: 10 items/page, adjustable sizes.
  - Actions: "Create Issue" button (opens dialog form), Edit icon per row (pre-filled dialog).
  - Row click (except buttons): Navigates to detail view.
- **Issue Detail Page** (`/issue/:id`): Material card showing full issue details (title, description, status/priority badges, assignee, dates).
  - "Back to List" button.
- **Forms/Validation**: Reactive forms in dialogs (required fields, min length, email validation).
- **Integration**: HttpClient calls APIs; auto-refreshes table after create/edit.
- **UI/UX**: Responsive, loading states, error messages (e.g., "No issues found").

Sample Data: 3 issues loaded on startup (e.g., "Login Bug" - open/high, "UI Glitch" - in-progress/medium, "Performance Issue" - closed/low).

## Tech Stack
- **Backend**: Python 3.8+, Flask, Flask-CORS, uuid, datetime (in-memory list as DB).
- **Frontend**: Angular 17+, Angular Material (table, dialog, forms), RxJS (observables), TypeScript.
- **Dependencies**:
  - Backend: `pip install flask flask-cors`.
  - Frontend: `npm install @angular/material @angular/cdk @angular/animations`.

## Setup and Running

### Prerequisites
- Python 3.8+ (for backend).
- Node.js 18+ and npm (for frontend).
- GitHub Codespaces or local dev environment.

### Backend Setup
1. Clone the repo: `git clone https://github.com/Bhanudheeravath15/issue-tracker.git && cd issue-tracker`.
2. Install dependencies: `pip install -r requirements.txt` (or manually: `pip install flask flask-cors`).
3. Run the server: `python app.py`.
   - Server starts on http://localhost:5000.
   - Test: Open another terminal → `curl http://localhost:5000/health` (returns `{"status": "ok"}`).
   - Full test: `curl http://localhost:5000/issues` (returns paginated JSON with 3 issues).

### Frontend Setup
1. Navigate to frontend: `cd issue-tracker-frontend`.
2. Install dependencies: `npm install`.
3. (Optional) Install Material: `npm install @angular/material @angular/cdk @angular/animations`.
4. Run the dev server: `ng serve --port 4200`.
   - App starts on http://localhost:4200.
   - Ensure backend is running (port 5000).
   - Open browser: http://localhost:4200/issues (redirects from root; shows table with 3 issues).

In GitHub Codespaces:
- Backend: Terminal 1 (root) → `python app.py` (forward port 5000).
- Frontend: Terminal 2 → `cd issue-tracker-frontend && ng serve --port 4200` (forward port 4200 → Open in browser).

## API Documentation

All endpoints return JSON. Base URL: http://localhost:5000.

- **GET /health**  
  Health check.  
  Response: `{"status": "ok"}` (200 OK).

- **GET /issues**  
  List issues with optional queries.  
  Query Params:  
  - `page` (default: 1), `pageSize` (default: 10).  
  - `search` (string: title/description).  
  - `status` (open/in-progress/closed), `priority` (low/medium/high), `assignee` (email).  
  - `sortBy` (id/title/status/priority/assignee/updatedAt), `sortOrder` (asc/desc, default: desc).  
  Example: `curl "http://localhost:5000/issues?page=1&pageSize=5&search=bug&status=open&sortBy=updatedAt&sortOrder=desc"`.  
  Response:  
  ```json
  {
    "issues": [ { "id": "uuid", "title": "...", "description": "...", "status": "open", "priority": "high", "assignee": "user@example.com", "createdAt": "2025-09-24T10:00:00Z", "updatedAt": "2025-09-24T10:00:00Z" } ],
    "page": 1, "pageSize": 5, "total": 3, "totalPages": 1
  }