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
  private jwtHelper: JwtHelperService;


  /**
   * Constructor for Grade Service
   * @param http 
   * @param authService 
   * @param router 
   */
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private router: Router

  ) {
    this.jwtHelper = new JwtHelperService();
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('currentUser'))) {
      this.authService.logout();
      this.router.navigate(['login', { expired: true }]);
    }
  }

  /**
   * Http get, return a list of all grades
   */
  public getGrades(): Observable<any> {
    return this.http.get<any>(endpoint, this.getHttpHeaders())
      .pipe(map((response: Response) => {

        return response;
      }));
  }

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