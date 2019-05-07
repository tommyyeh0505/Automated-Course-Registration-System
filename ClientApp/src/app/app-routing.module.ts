import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClassComponent } from './components/class/class.component';
import { AuthGuard } from './guard/guard.guard';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ErrorComponent } from './components/error/error.component';
import { CourseComponent } from './components/course/course.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { StudentComponent } from './components/student/student.component';
import { ClassDetailComponent } from './components/class-detail/class-detail.component';

const routes: Routes = [
  //path: '', component: LayoutComponent, canActivate: [AuthGuard],
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, },
      { path: 'student', component: StudentComponent },
      { path: 'index', component: DashboardComponent },
      { path: 'upload', component: UploadComponent, },
      { path: 'class', component: ClassComponent },
      { path: 'class/:id', component: ClassDetailComponent },
      { path: 'course', component: CourseComponent },
      { path: 'course/:id', component: CourseDetailComponent },
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
