import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';

import { HttpClient } from 'selenium-webdriver/http';

import { AuthenticationService } from './authentication.service';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { Waitlist } from '../models/waitlist';

import { HttpHeaders } from '@angular/common/http';

const endpoint = environment.apiEndpoint + 'waitlists/';
@Injectable({
  providedIn: 'root'
})
export class WaitlistService {
  private jwtHelper: JwtHelperService;


  /**
   * Constructor for Waitlist Service
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



  public getWaitlists(): Observable<any> {
    return this.http.get<any>(endpoint, this.getHttpHeaders())
      .pipe(map((response: Response) => response || {}));
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