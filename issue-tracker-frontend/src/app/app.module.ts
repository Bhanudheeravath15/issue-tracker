import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material Imports (shared across app)
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent  // Root component (toolbar + router-outlet)
  ],
  imports: [
    BrowserModule,  // Core Angular
    AppRoutingModule,  // Routes to /issues, /issue/:id
    HttpClientModule,  // For IssueService API calls
    FormsModule,  // Template-driven forms (if needed)
    ReactiveFormsModule,  // Reactive forms for IssueForm
    BrowserAnimationsModule,  // Material animations

    // Material UI Modules (fixes NG8001 for mat-table, mat-form-field, etc.)
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  providers: [],  // Services auto-provided via @Injectable
  bootstrap: [AppComponent]  // Starts app with AppComponent
})
export class AppModule { }