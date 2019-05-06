import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Grade } from '../models/grade';
const endpoint = environment.apiEndpoint + 'grades/';
@Injectable({
  providedIn: 'root'
})
export class GradeService {

  constructor() { }
  public deleteGrade(grade: Grade) {

    let id = grade.gradeId;
    this.http.delete<any>(endpoint + id, this.getHttpHeaders())
      .subscribe();
    return grade;
  }

  // HTTP headers
  private getHttpHeaders(): {} {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
        'Content-Type': 'application/json'
      })
    };
  }
}
