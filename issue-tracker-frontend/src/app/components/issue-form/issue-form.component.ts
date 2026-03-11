import { Component, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';
import { MatButtonModule }     from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

type FormKeys = 'title' | 'description' | 'status' | 'priority' | 'assignee';

type IssueFormGroup = {
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<string>;
  priority: FormControl<string>;
  assignee: FormControl<string>;
};

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
  form: FormGroup<IssueFormGroup>;

  statuses   = ['open', 'in progress', 'resolved', 'closed'];
  priorities = ['low', 'medium', 'high', 'urgent'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IssueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Use nonNullable controls so each control is FormControl<string> (not string | null)
    this.form = this.fb.group<IssueFormGroup>({
      title:       this.fb.nonNullable.control<string>(data?.title ?? '', [Validators.required, Validators.maxLength(120)]),
      description: this.fb.nonNullable.control<string>(data?.description ?? '', [Validators.required, Validators.maxLength(2000)]),
      status:      this.fb.nonNullable.control<string>(data?.status ?? 'open', [Validators.required]),
      priority:    this.fb.nonNullable.control<string>(data?.priority ?? 'medium', [Validators.required]),
      assignee:    this.fb.nonNullable.control<string>(data?.assignee ?? '', [Validators.maxLength(100)])
    });
  }

  // Returns a properly typed controls map -> dot access (f.title) is allowed in the template
  get f(): IssueFormGroup {
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

  getErrorMessage(controlName: FormKeys): string {
    const ctrl = this.form.get(controlName);
    if (!ctrl) return '';

    if (ctrl.hasError('required'))  return 'This field is required';
    if (ctrl.hasError('maxlength')) return 'Too long';
    if (ctrl.hasError('minlength')) return 'Too short';
    if (ctrl.hasError('email'))     return 'Invalid email';
    return 'Invalid value';
  }
}