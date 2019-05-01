import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';


const endpoint = "https://fsassnbackend.azurewebsites.net/api/boats/";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private jwtHelper: JwtHelperService;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.jwtHelper = new JwtHelperService();
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('token'))) {
      this.authService.logout();
      this.router.navigate(['/login', { expired: true }]);
    }
  }

  // public getBoats() {
  //   return this.http.get<any>(endpoint, this.getHttpOptions())
  //     .pipe(map((response: Response) => response || {}));
  // }

  // public getBoat(id: number) {
  //   return this.http.get<any>(endpoint + id, this.getHttpOptions())
  //     .pipe(map((response: Response) => response || {}));
  // }

  // public addBoat(boat: BoatModel) {
  //   return this.http.post<any>(endpoint, boat, this.getHttpOptions())
  //     .pipe(map((response: Response) => response || {}));
  // }

  // public updateBoat(id: number, boat: BoatModel) {
  //   return this.http.put<any>(endpoint + id, boat, this.getHttpOptions())
  //     .pipe(map((response: Response) => response || {}));
  // }

  // public deleteBoat(id: number) {
  //   return this.http.delete<any>(endpoint + id, this.getHttpOptions())
  //     .pipe(map((response: Response) => response || {}));
  // }

  private getHttpOptions(): {} {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      })
    };
  }
}
