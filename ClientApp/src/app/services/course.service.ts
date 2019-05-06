import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../models/course';
const endpoint = environment.apiEndpoint + 'courses';
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor() { }
  public getCourse(course: Course) {
    let id = course.courseId;
    this.http.get<any>(endpoint + id, this.getHttpHeaders())
      .subscribe();
    return course;
  }
  public deleteCourse(course: Course) {

    let id = course.courseId;
    this.http.delete<any>(endpoint + id, this.getHttpHeaders())
      .subscribe();
    return course;
  }

  // HTTP headers
  private getHttpHeaders(): {} {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      })
    };
  }
}
