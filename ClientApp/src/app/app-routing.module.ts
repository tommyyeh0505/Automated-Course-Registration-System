import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GradeComponent } from './components/grade/grade.component';
import { AuthGuard } from './guard/guard.guard';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ErrorComponent } from './components/error/error.component';
import { CourseComponent } from './components/course/course.component';

const routes: Routes = [
  //path: '', component: LayoutComponent, canActivate: [AuthGuard],
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, },
      { path: 'index', component: DashboardComponent },
      { path: 'upload', component: UploadComponent, },
      { path: 'grade', component: GradeComponent },
      { path: 'course', component: CourseComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', redirectTo: 'login' },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
