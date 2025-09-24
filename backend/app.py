from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Enables CORS for frontend (allows localhost:4200+ to connect)

# In-memory storage for issues (simple "database" - data resets on restart)
issues_db = [
    {
        "id": str(uuid.uuid4())[:8],
        "title": "Login Bug",
        "description": "Users can't log in with valid credentials.",
        "status": "open",
        "priority": "high",
        "assignee": "dev1@example.com",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
    },
    {
        "id": str(uuid.uuid4())[:8],
        "title": "UI Glitch on Mobile",
        "description": "Navigation menu overlaps on small screens.",
        "status": "in-progress",
        "priority": "medium",
        "assignee": "dev2@example.com",
        "createdAt": "2024-01-16T14:30:00Z",
        "updatedAt": "2024-01-17T09:15:00Z"
    },
    {
        "id": str(uuid.uuid4())[:8],
        "title": "Performance Issue",
        "description": "Page load time exceeds 5 seconds on dashboard.",
        "status": "closed",
        "priority": "low",
        "assignee": "dev3@example.com",
        "createdAt": "2024-01-10T08:45:00Z",
        "updatedAt": "2024-01-20T16:20:00Z"
    }
]

@app.route('/issues', methods=['GET'])
def get_issues():
    # Get query params for pagination, search, filters, sorting
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))
    search = request.args.get('search', '').lower()
    status = request.args.get('status', '')
    priority = request.args.get('priority', '')
    assignee = request.args.get('assignee', '').lower()
    sort_by = request.args.get('sortBy', 'updatedAt')
    sort_order = request.args.get('sortOrder', 'desc')

    # Filter issues
    filtered_issues = issues_db
    if search:
        filtered_issues = [issue for issue in filtered_issues if search in issue['title'].lower() or search in issue['description'].lower()]
    if status:
        filtered_issues = [issue for issue in filtered_issues if issue['status'] == status]
    if priority:
        filtered_issues = [issue for issue in filtered_issues if issue['priority'] == priority]
    if assignee:
        filtered_issues = [issue for issue in filtered_issues if assignee in issue['assignee'].lower()]

    # Sort issues
    reverse = sort_order == 'desc'
    if sort_by == 'title':
        filtered_issues.sort(key=lambda x: x['title'], reverse=reverse)
    elif sort_by == 'status':
        filtered_issues.sort(key=lambda x: x['status'], reverse=reverse)
    elif sort_by == 'priority':
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        filtered_issues.sort(key=lambda x: priority_order.get(x['priority'], 0), reverse=reverse)
    elif sort_by == 'assignee':
        filtered_issues.sort(key=lambda x: x['assignee'], reverse=reverse)
    elif sort_by == 'updatedAt':
        filtered_issues.sort(key=lambda x: datetime.fromisoformat(x['updatedAt'].replace('Z', '+00:00')), reverse=reverse)

    # Pagination
    total = len(filtered_issues)
    start = (page - 1) * page_size
    end = start + page_size
    paginated_issues = filtered_issues[start:end]

    return jsonify({
        'issues': paginated_issues,
        'page': page,
        'pageSize': page_size,
        'total': total,
        'totalPages': (total + page_size - 1) // page_size
    })

@app.route('/issues/<issue_id>', methods=['GET'])
def get_issue(issue_id):
    issue = next((issue for issue in issues_db if issue['id'] == issue_id), None)
    if issue:
        return jsonify(issue)
    return jsonify({'error': 'Issue not found'}), 404

@app.route('/issues', methods=['POST'])
def create_issue():
    data = request.json
    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'error': 'Title and description are required'}), 400

    new_issue = {
        'id': str(uuid.uuid4())[:8],
        'title': data['title'],
        'description': data['description'],
        'status': data.get('status', 'open'),
        'priority': data.get('priority', 'medium'),
        'assignee': data.get('assignee', ''),
        'createdAt': datetime.utcnow().isoformat() + 'Z',
        'updatedAt': datetime.utcnow().isoformat() + 'Z'
    }
    issues_db.append(new_issue)
    return jsonify(new_issue), 201

@app.route('/issues/<issue_id>', methods=['PUT'])
def update_issue(issue_id):
    issue = next((issue for issue in issues_db if issue['id'] == issue_id), None)
    if not issue:
        return jsonify({'error': 'Issue not found'}), 404

    data = request.json
    if data.get('title'):
        issue['title'] = data['title']
    if data.get('description'):
        issue['description'] = data['description']
    if data.get('status'):
        issue['status'] = data['status']
    if data.get('priority'):
        issue['priority'] = data['priority']
    if data.get('assignee'):
        issue['assignee'] = data['assignee']
    issue['updatedAt'] = datetime.utcnow().isoformat() + 'Z'

    return jsonify(issue)

if __name__ == '__main__':
    app.run(debug=True, port=5000)