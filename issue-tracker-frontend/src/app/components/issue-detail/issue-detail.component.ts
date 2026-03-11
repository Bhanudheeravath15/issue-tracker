import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue.model';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  issue!: Issue;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.issueService.getIssueById(id).subscribe({
        next: (issue: Issue) => {
          this.issue = issue;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Issue not found';
          this.loading = false;
          console.error('Error loading issue:', err);
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/issues']);
  }
}
