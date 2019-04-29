import { Injectable, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const endpoint = "https://fsassnbackend.azurewebsites.net/login";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>(endpoint, {
      "username": username,
      "password": password
    }).pipe(map(jwt => {
      if (jwt) {
        localStorage.setItem('token', jwt.token);
        localStorage.setItem('role', jwt.role[0]);
        return jwt;
      }
    }));
  }

  @HostListener('window:beforeunload', ['$event'])
  logout() {
    localStorage.removeItem('token');
  }
}
