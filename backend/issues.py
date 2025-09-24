import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum

class Status(Enum):
    OPEN = "open"
    IN_PROGRESS = "in-progress"
    CLOSED = "closed"

class Priority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

@dataclass
class Issue:
    id: str
    title: str
    description: str
    status: Status
    priority: Priority
    assignee: str
    createdAt: str
    updatedAt: str

class IssueStore:
    def __init__(self):
        self.issues: List[Issue] = []

    def create(self, title: str, description: str, status: Status, priority: Priority, assignee: str) -> Issue:
        issue = Issue(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            status=status,
            priority=priority,
            assignee=assignee,
            createdAt=datetime.now().isoformat(),
            updatedAt=datetime.now().isoformat()
        )
        self.issues.append(issue)
        return issue

    def get_all(self, search: str = "", status: Optional[str] = None, priority: Optional[str] = None,
                assignee: Optional[str] = None, sort_by: str = "updatedAt", sort_order: str = "desc",
                page: int = 1, page_size: int = 10) -> Dict[str, Any]:
        filtered = self.issues[:]
        
        # Search by title
        if search:
            filtered = [i for i in filtered if search.lower() in i.title.lower()]
        
        # Filters
        if status:
            filtered = [i for i in filtered if i.status.value == status]
        if priority:
            filtered = [i for i in filtered if i.priority.value == priority]
        if assignee:
            filtered = [i for i in filtered if assignee.lower() in i.assignee.lower()]
        
        # Sort
        reverse = sort_order == "desc"
        if sort_by == "title":
            filtered.sort(key=lambda i: i.title.lower(), reverse=reverse)
        elif sort_by == "status":
            filtered.sort(key=lambda i: i.status.value, reverse=reverse)
        elif sort_by == "priority":
            filtered.sort(key=lambda i: i.priority.value, reverse=reverse)
        elif sort_by == "assignee":
            filtered.sort(key=lambda i: i.assignee.lower(), reverse=reverse)
        else:  # default updatedAt
            filtered.sort(key=lambda i: i.updatedAt, reverse=reverse)
        
        # Pagination
        total = len(filtered)
        start = (page - 1) * page_size
        end = start + page_size
        paginated = filtered[start:end]
        
        return {
            "issues": [self._to_dict(i) for i in paginated],
            "total": total,
            "page": page,
            "pageSize": page_size,
            "totalPages": (total + page_size - 1) // page_size
        }

    def get_by_id(self, issue_id: str) -> Optional[Issue]:
        for issue in self.issues:
            if issue.id == issue_id:
                return issue
        return None

    def update(self, issue_id: str, **kwargs) -> Optional[Issue]:
        issue = self.get_by_id(issue_id)
        if not issue:
            return None
        for key, value in kwargs.items():
            if hasattr(issue, key) and key != "id":
                setattr(issue, key, value)
        issue.updatedAt = datetime.now().isoformat()
        return issue

    def _to_dict(self, issue: Issue) -> Dict[str, Any]:
        return {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "status": issue.status.value,
            "priority": issue.priority.value,
            "assignee": issue.assignee,
            "createdAt": issue.createdAt,
            "updatedAt": issue.updatedAt
        }