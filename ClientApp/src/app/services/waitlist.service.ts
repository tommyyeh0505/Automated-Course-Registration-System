import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Waitlist } from '../models/waitlist';
const endpoint = environment.apiEndpoint + 'waitlists/';
@Injectable({
  providedIn: 'root'
})
export class WaitlistService {
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
  public getWaitlists(): Observable<any> {
    return this.http.get<any>(endpoint, this.getHttpHeaders())
      .pipe(map((response: Response) => {

        return response;
      }));
  }

  public deleteWaitlist(waitlist: Waitlist) {
    let id = waitlist.waitlistId;
    this.http.delete<any>(endpoint + id, this.getHttpHeaders())
      .subscribe();
    return waitlist;
  }

  public addWaitlist(waitlist: Waitlist) {
    return this.http.post<any>(endpoint, waitlist, this.getHttpHeaders())
      .pipe(map((response: Response) => response || {}));

  }

  public getWaitlistsByKey(courseId: string, crn: string, term: string) {
    return this.http.get<any>(endpoint + `filter/${courseId}/${crn}/${term}`, this.getHttpHeaders())
      .pipe(map((response: Response) => response || {}))
  }

  public updateWaitlist(waitlistId: number, editWaitlist: Waitlist) {
    return this.http.put<any>(endpoint + waitlistId, editWaitlist, this.getHttpHeaders()).pipe(map((response: Response) => response || {}));
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
