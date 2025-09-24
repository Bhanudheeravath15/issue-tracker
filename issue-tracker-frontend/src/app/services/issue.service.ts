import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Issue, PaginatedIssues } from '../models/issue.model';  // Path from services/ to models/

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = `${environment.apiUrl}/issues`;

  constructor(private http: HttpClient) {}

  getIssues(params: {
    page?: number; pageSize?: number; search?: string; status?: string;
    priority?: string; assignee?: string; sortBy?: string; sortOrder?: 'asc' | 'desc';
  } = {}): Observable<PaginatedIssues> {
    let httpParams = new HttpParams()
      .set('page', (params.page || 1).toString())
      .set('pageSize', (params.pageSize || 10).toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.priority) httpParams = httpParams.set('priority', params.priority);
    if (params.assignee) httpParams = httpParams.set('assignee', params.assignee);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    return this.http.get<PaginatedIssues>(this.apiUrl, { params: httpParams });
  }

  getIssueById(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`);
  }

  createIssue(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, issue);
  }

  updateIssue(id: string, issue: Partial<Issue>): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/${id}`, issue);
  }
}