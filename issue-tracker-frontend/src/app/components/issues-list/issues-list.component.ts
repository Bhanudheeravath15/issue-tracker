import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { IssueService, PaginatedIssues, Issue } from '../../services/issue.service';
import { IssueFormComponent } from '../issue-form/issue-form.component';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Material (include the ones you actually use in the template)
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  // table data
  issues: Issue[] = [];
  paginatedData: PaginatedIssues | null = null;

  // paging & totals
  page = 1;
  pageSize = 10;
  totalPages = 0;

  // filters
  searchTerm = '';
  statusFilter: string | null = null;
  priorityFilter: string | null = null;
  assigneeFilter: string | null = null;

  // sorting
  sortBy: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  displayedColumns: string[] = ['title', 'status', 'priority', 'assignee', 'createdAt', 'actions'];

  constructor(
    private issueService: IssueService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadIssues();
  }

  // ✅ Step 5 fix: use a compatible subscribe signature
  // Option A (typed) — if your IssueService.getIssues() returns Observable<PaginatedIssues>
  loadIssues(): void {
    this.issueService.getIssues({
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
      assignee: this.assigneeFilter || undefined,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    }).subscribe((data: PaginatedIssues) => {
      this.paginatedData = data;
      this.issues = data.issues;
      this.totalPages = data.totalPages;
    });
  }

  // If your service currently returns Observable<any>, you can instead use:
  // }).subscribe((data: any) => { ... });

  onSearch(): void {
    this.page = 1;
    this.loadIssues();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadIssues();
  }

  onSortChange(sort: Sort): void {
    if (sort.active) this.sortBy = sort.active;
    if (sort.direction) this.sortOrder = sort.direction as 'asc' | 'desc';
    this.loadIssues();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadIssues();
  }

  // (Optional) Open create dialog and refresh on success
  openCreateDialog(): void {
    const ref = this.dialog.open(IssueFormComponent, {
      width: '600px',
      data: {} // pass defaults if needed
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.issueService.createIssue(result).subscribe(() => this.loadIssues());
      }
    });
  }
}

