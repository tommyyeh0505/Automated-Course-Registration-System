import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
const endpoint = `${environment.apiEndpoint}/courses`;
@Injectable({
  providedIn: 'root'
})
export class CourseService {
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
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('token'))) {
      this.authService.logout();
      this.router.navigate(['login', { expired: true }]);
    }
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
