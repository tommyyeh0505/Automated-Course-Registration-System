import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { first, isEmpty } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  authFailed: boolean = false;
  fromExpiration: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {

    this.authenticationService.logout();

    if (this.route.snapshot.paramMap.get('expired')) {
      this.fromExpiration = true;
    }

    if (localStorage.getItem('currentUser')) {
      let token = JSON.parse(localStorage.getItem('currentUser')).token;

      const isExpired = helper.isTokenExpired(token);
      if (isExpired) {
        this.authenticationService.logout();
      } else {
        this.router.navigate(['/']);
      }
      return true;
    }
  }

  submit() {
    let username: string = this.form.value.username;
    let password: string = this.form.value.password;

    if (username.trim().length == 0 || password.trim().length == 0) {
      return;
    }



    this.authenticationService.login(username, password)
      .pipe(first())
      .subscribe(
        data => {


          this.authFailed = false;
          this.router.navigate(['/']); //navigate to home
        },
        error => {
          this.authFailed = true;


        }
      );
  }

  hasError() {
    return this.authFailed;
  }
  getErrorMessage() {
    return "Invalid Username or Password";
  }

}
