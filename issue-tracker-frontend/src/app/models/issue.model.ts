export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedIssues {
  issues: Issue[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DialogData {
  mode: 'create' | 'edit';
  issue?: Issue;
}