import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Waitlist } from '../models/waitlist';
const endpoint = environment.apiEndpoint + 'download/';
@Injectable({
    providedIn: 'root'
})
export class DownloadService {
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


    public downloadWaitlist() {
        window.location.href = endpoint + 'waitlist';
    }

    public downloadWaitlistEligible() {
        window.location.href = endpoint + 'waitlist/eligible';
    }

    public downloadWaitlistIneligible() {
        window.location.href = endpoint + 'waitlist/ineligible';
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
