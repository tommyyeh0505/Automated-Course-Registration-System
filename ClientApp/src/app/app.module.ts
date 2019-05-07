import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './components/upload/upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatProgressBarModule, MatDialogModule, MatSnackBarModule, MatSelectModule, MatAutocompleteModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GradeComponent } from './components/grade/grade.component';
import { LoginComponent } from './components/login/login.component';
import { DropFileDirective } from './directives/drop-file.directive';
import { LayoutComponent } from './components/layout/layout.component';
import { ErrorComponent } from './components/error/error.component';
import { CourseComponent } from './components/course/course.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StudentComponent } from './components/student/student.component';
import { AddCourseComponent } from './components/modals/course/add/add-course.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    DashboardComponent,
    GradeComponent,
    LoginComponent,
    DropFileDirective,
    LayoutComponent,
    ErrorComponent,
    CourseComponent,
    StudentComponent,
    AddCourseComponent,
    CourseDetailComponent,
  ],
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AddCourseComponent
  ]
})
export class AppModule { }
