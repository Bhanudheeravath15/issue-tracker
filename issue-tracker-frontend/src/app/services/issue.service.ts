import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private baseUrl = environment.apiBaseUrl; // ✅ use apiBaseUrl

  constructor(private http: HttpClient) {}

  getIssues(params: any) {
    return this.http.get(`${this.baseUrl}/issues`, { params });
    // or `${this.baseUrl}/api/issues` if your backend routes are prefixed with /api
  }

  // Add other methods: create, update, delete, etc.
}
``