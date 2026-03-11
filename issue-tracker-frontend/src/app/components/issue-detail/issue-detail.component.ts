import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IssueService, Issue } from '../../services/issue.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  issue?: Issue;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.issueService.getIssueById(id).subscribe((data: Issue) => {
        this.issue = data;
      });
    }
  }
}
