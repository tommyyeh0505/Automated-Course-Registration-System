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
  isLoading: boolean = false;
  authFailed: boolean = false;
  fromExpiration: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {

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
<<<<<<< HEAD
    let username = this.form.value.username;
    let password = this.form.value.password;
=======
    let username: string = this.form.value.username;
    let password: string = this.form.value.password;

    if (username.trim().length == 0 || password.trim().length == 0) {
      return;
    }

    this.isLoading = true;
>>>>>>> 8296f65cc7c02cf7e0cc5615dbdc6567e5ab5734

    this.authenticationService.login(username, password)
      .pipe(first())
      .subscribe(
        data => {


          this.authFailed = false;
          this.router.navigate(['/']); //navigate to home
        },
        error => {
          console.log(123);
          this.authFailed = true;


        }
      );
  }

<<<<<<< HEAD
  hasError() {
    return this.authFailed;
  }

=======
>>>>>>> 8296f65cc7c02cf7e0cc5615dbdc6567e5ab5734
  getErrorMessage() {
    return "Invalid Username or Password";
  }

}
