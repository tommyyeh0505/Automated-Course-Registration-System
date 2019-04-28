import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GradeComponent } from './grade/grade.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'grade', component: GradeComponent },
  { path: 'course', component: UploadComponent },
  { path: '**', component: UploadComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
