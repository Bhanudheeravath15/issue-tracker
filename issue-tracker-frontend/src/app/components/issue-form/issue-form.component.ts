import { Component, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';
import { MatButtonModule }     from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss']
})
export class IssueFormComponent {
  form: FormGroup;

  statuses   = ['open', 'in progress', 'resolved', 'closed'];
  priorities = ['low', 'medium', 'high', 'urgent'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IssueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      title:       [data?.title ?? '', [Validators.required, Validators.maxLength(120)]],
      description: [data?.description ?? '', [Validators.required, Validators.maxLength(2000)]],
      status:      [data?.status ?? 'open', [Validators.required]],
      priority:    [data?.priority ?? 'medium', [Validators.required]],
      assignee:    [data?.assignee ?? '', [Validators.maxLength(100)]]
    });
  }

  // easy access to form controls in the template
  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  getErrorMessage(controlName: keyof typeof this.form.controls): string {
    const ctrl = this.form.get(controlName);
    if (!ctrl) return '';
    if (ctrl.hasError('required'))  return 'This field is required';
    if (ctrl.hasError('maxlength')) return 'Too long';
    if (ctrl.hasError('minlength')) return 'Too short';
    if (ctrl.hasError('email'))     return 'Invalid email';
    return 'Invalid value';
  }
}