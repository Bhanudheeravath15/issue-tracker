import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedIssues {
  issues: Issue[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class IssueService {
  private baseUrl = environment.apiBaseUrl; // e.g. https://issue-tracker-3-oay9.onrender.com

  constructor(private http: HttpClient) {}

  getIssues(query: {
    page: number; pageSize: number; search?: string; status?: string; priority?: string;
    assignee?: string; sortBy?: string; sortOrder?: 'asc' | 'desc';
  }): Observable<PaginatedIssues> {
    const params = new HttpParams({ fromObject: {
      page: String(query.page),
      pageSize: String(query.pageSize),
      search: query.search ?? '',
      status: query.status ?? '',
      priority: query.priority ?? '',
      assignee: query.assignee ?? '',
      sortBy: query.sortBy ?? '',
      sortOrder: query.sortOrder ?? ''
    }});
    // If your backend uses /api/issues, change the path below accordingly:
    return this.http.get<PaginatedIssues>(`${this.baseUrl}/issues`, { params });
  }

  getIssueById(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.baseUrl}/issues/${id}`);
  }

  createIssue(payload: Partial<Issue>): Observable<Issue> {
    return this.http.post<Issue>(`${this.baseUrl}/issues`, payload);
  }
}