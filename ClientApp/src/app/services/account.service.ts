import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UpdatePassword } from '../models/updatePassword';
import { map } from 'rxjs/operators';
const endpoint = environment.apiEndpoint + 'auth/users/';
@Injectable({
    providedIn: 'root'
})
export class AccountService {
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
        //     this.authService.logout();
        //     this.router.navigate(['login', { expired: true }]);
        // }
    }

    /**
     * Http get, return a list of all courses
     */
    public updatePassword(newPassword: UpdatePassword) {
        return this.http.put<any>(endpoint + newPassword.username, newPassword).pipe(map((response: Response) => response || {}));
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
