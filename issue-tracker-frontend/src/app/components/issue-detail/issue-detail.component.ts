import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { IssueService, Issue } from '../../services/issue.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  issue?: Issue;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Missing issue id';
      return;
    }

    this.loading = true;
    this.issueService.getIssueById(id).subscribe({
      next: (data: Issue) => {
        this.issue = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load issue.';
        this.loading = false;
      }
    });
  }

  onBack(): void {
    this.location.back();
  }
}
