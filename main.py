from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import uuid
import json
import os

DATA_FILE = "issues.json"

app = FastAPI(title="Simple Issue Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Issue(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    status: Optional[str] = "Open"
    priority: Optional[str] = "Medium"
    assignee: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

class IssueCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    status: Optional[str] = "Open"
    priority: Optional[str] = "Medium"
    assignee: Optional[str] = None

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None

# Simple persistence to a JSON file
def load_issues() -> List[dict]:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def save_issues(data: List[dict]):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, default=str, indent=2)

issues = load_issues()

@app.get("/health")
def health():
    return {"status": "ok"}

def apply_filters(items, q: Optional[str], status: Optional[str], priority: Optional[str], assignee: Optional[str]):
    if q:
        items = [i for i in items if q.lower() in i.get("title","").lower()]
    if status:
        items = [i for i in items if i.get("status") == status]
    if priority:
        items = [i for i in items if i.get("priority") == priority]
    if assignee:
        items = [i for i in items if i.get("assignee") == assignee]
    return items

@app.get("/issues")
def list_issues(page: int = 1, pageSize: int = 10, q: Optional[str] = None, status: Optional[str] = None, priority: Optional[str] = None, assignee: Optional[str] = None, sortBy: Optional[str] = "updatedAt", sortDir: Optional[str] = "desc"):
    items = issues.copy()
    items = apply_filters(items, q, status, priority, assignee)
    reverse = sortDir.lower() == "desc"
    if sortBy in {"createdAt","updatedAt","title","priority","status","assignee","id"}:
        items.sort(key=lambda x: x.get(sortBy) or "", reverse=reverse)
    total = len(items)
    start = (page - 1) * pageSize
    end = start + pageSize
    return {"items": items[start:end], "total": total, "page": page, "pageSize": pageSize}

@app.get("/issues/{issue_id}")
def get_issue(issue_id: str):
    for i in issues:
        if i["id"] == issue_id:
            return i
    raise HTTPException(status_code=404, detail="Issue not found")

@app.post("/issues", status_code=201)
def create_issue(payload: IssueCreate):
    now = datetime.utcnow().isoformat()
    new = {
        "id": str(uuid.uuid4()),
        "title": payload.title,
        "description": payload.description,
        "status": payload.status,
        "priority": payload.priority,
        "assignee": payload.assignee,
        "createdAt": now,
        "updatedAt": now
    }
    issues.insert(0, new)
    save_issues(issues)
    return new

@app.put("/issues/{issue_id}")
def update_issue(issue_id: str, payload: IssueUpdate):
    for idx, i in enumerate(issues):
        if i["id"] == issue_id:
            updated = i.copy()
            for k, v in payload.dict(exclude_unset=True).items():
                updated[k] = v
            updated["updatedAt"] = datetime.utcnow().isoformat()
            issues[idx] = updated
            save_issues(issues)
            return updated
    raise HTTPException(status_code=404, detail="Issue not found")

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)