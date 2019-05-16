import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../models/course';
import { Student } from '../models/student';
const endpoint = environment.apiEndpoint + 'students/';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
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
    // this.jwtHelper = new JwtHelperService();
    // if (this.jwtHelper.isTokenExpired(localStorage.getItem('currentUser'))) {
    //   this.authService.logout();
    //   this.router.navigate(['login', { expired: true }]);
    // }
  }

  /**
   * Http get, return a list of all courses
   */
  public getStudents(): Observable<any> {
    return this.http.get<any>(endpoint, this.getHttpHeaders())
      .pipe(map((response: Response) => response || {}));
  }

  public getStudent(studentId: string) {
    return this.http.get<any>(endpoint + studentId, this.getHttpHeaders())
      .pipe(map((response: Response) => response || {}));
  }

  public updateStudent(studentId: string, editStudent: Student) {
    return this.http.put<any>(endpoint + studentId, editStudent, this.getHttpHeaders())
      .pipe(map((response: Response) => response || {}));
  }

  public addStudent(student: Student) {

    return this.http.post<any>(endpoint, student, this.getHttpHeaders())
      .pipe(map((response: Response) => response || {}));
  }

  public getStudentGrades(studentId: string) {
    return this.http.get<any>(endpoint + studentId + '/grades/', this.getHttpHeaders())
      .pipe(map((response: Response) => response || {}));
  }


  // HTTP headers
  private getHttpHeaders(): {} {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
        'Content-Type': 'application/json'
      })
    };
  }
}