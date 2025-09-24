import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IssueService } from '../../services/issue.service';
import { PaginatedIssues, Issue } from '../../models/issue.model';
import { IssueFormComponent } from '../issue-form/issue-form.component';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDialogModule
  ],
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  issues: Issue[] = [];
  paginatedData!: PaginatedIssues;
  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'assignee', 'updatedAt', 'actions'];

  // Pagination & Filters
  page = 1;
  pageSize = 10;
  totalPages = 0;
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  assigneeFilter = '';

  // Sorting
  sortBy = 'updatedAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  statuses = ['open', 'in-progress', 'closed'];
  priorities = ['low', 'medium', 'high'];

  constructor(
    private issueService: IssueService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadIssues();
  }

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
    }).subscribe({
      next: (data) => {
        this.paginatedData = data;
        this.issues = data.issues;
        this.totalPages = data.totalPages;
      },
      error: (err) => console.error('Error loading issues:', err)
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadIssues();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadIssues();
  }

  onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.sortBy = sort.active;
      this.sortOrder = sort.direction as 'asc' | 'desc';
      this.loadIssues();
    }
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadIssues();
  }

  onRowClick(issue: Issue, event: Event): void {
    // Prevent click if on button
    if ((event.target as HTMLElement).tagName === 'BUTTON' || (event.target as HTMLElement).tagName === 'MAT-ICON') {
      return;
    }
    this.router.navigate(['/issue', issue.id]);
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '600px',
      data: { mode: 'create' as const }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadIssues();
    });
  }

  onEdit(issue: Issue): void {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '600px',
      data: { mode: 'edit' as const, issue }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadIssues();
    });
  }
}
