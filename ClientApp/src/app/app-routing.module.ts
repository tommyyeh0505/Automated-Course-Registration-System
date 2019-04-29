import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GradeComponent } from './components/grade/grade.component';
import { AuthGuard } from './guard/guard.guard';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [

  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'upload', component: UploadComponent, },
      { path: 'grade', component: GradeComponent },
      { path: 'course', component: UploadComponent }
    ]
  },
  { path: 'login', component: LoginComponent },

  { path: '**', component: UploadComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
