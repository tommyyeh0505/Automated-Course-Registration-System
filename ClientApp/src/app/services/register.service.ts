import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

const endpoint = "https://fsassnbackend.azurewebsites.net/register";
const validationEndpoint = "https://fsassnbackend.azurewebsites.net/validate/"

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(model: User) {
    return this.http.post<any>(endpoint, model)
      .pipe(map(result => {
        return result;
      }));
  }

  isValidUsername(username: string) {
    return this.http.post<any>(validationEndpoint + "username", JSON.stringify(username), httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  isValidEmail(email: string) {
    return this.http.post<any>(validationEndpoint + "email", JSON.stringify(email), httpOptions)
    .pipe(map(result => {
      return result;
    }));
  }

}
