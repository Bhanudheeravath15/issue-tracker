import { Routes } from '@angular/router';
import { IssuesListComponent } from './components/issues-list/issues-list.component';
import { IssueDetailComponent } from './components/issue-detail/issue-detail.component';

export const routes: Routes = [
  { path: '', component: IssuesListComponent },
  { path: 'issues/:id', component: IssueDetailComponent },
  { path: '**', redirectTo: '' }
];
``
