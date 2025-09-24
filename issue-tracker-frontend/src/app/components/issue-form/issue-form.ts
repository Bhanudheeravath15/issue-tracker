import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue.model';

interface DialogData {
  mode: 'create' | 'edit';
  issue?: Issue;
}

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss']
})
export class IssueFormComponent {
  form!: FormGroup;
  isEdit = this.data.mode === 'edit';
  title = this.isEdit ? 'Edit Issue' : 'Create New Issue';
  statuses = ['open', 'in-progress', 'closed'];
  priorities = ['low', 'medium', 'high'];

  constructor(
    public dialogRef: MatDialogRef<IssueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private issueService: IssueService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      status: ['open', [Validators.required]],
      priority: ['medium', [Validators.required]],
      assignee: ['', [Validators.required, Validators.email]]
    });

    // Pre-populate for edit mode
    if (this.isEdit && this.data.issue) {
      this.form.patchValue(this.data.issue);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      if (this.isEdit && this.data.issue) {
        // Update existing issue
        this.issueService.updateIssue(this.data.issue.id, formValue).subscribe({
          next: (updatedIssue) => {
            this.dialogRef.close(updatedIssue);
          },
          error: (err) => {
            console.error('Error updating issue:', err);
            // You can add a toast/snackbar here for user feedback
            this.dialogRef.close(null);
          }
        });
      } else {
        // Create new issue
        this.issueService.createIssue(formValue).subscribe({
          next: (newIssue) => {
            this.dialogRef.close(newIssue);
          },
          error: (err) => {
            console.error('Error creating issue:', err);
            this.dialogRef.close(null);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('minlength')) return 'Minimum length is 3 characters';
    if (control?.hasError('email')) return 'Invalid email address';
    return '';
  }
}
