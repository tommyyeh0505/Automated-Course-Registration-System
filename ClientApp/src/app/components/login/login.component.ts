import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { first, isEmpty } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    private authenticationService: AuthenticationService) {

  }
  ngOnInit() {

    this.authenticationService.logout();

    if (this.route.snapshot.paramMap.get('expired')) {
      this.fromExpiration = true;
    }
  }

  submit() {
    let username = this.form.value.username;
    let password = this.form.value.password;
    this.isLoading = true;
    this.authenticationService.login(username, password)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.isLoading = false;
          this.authFailed = false;
          this.router.navigate(['/']); //navigate to home
        },
        error => {
          this.authFailed = true;
          this.isLoading = false;
        }
      );
  }

  hasError() {
    return this.authFailed;
  }
  getErrorMessage() {

    return this.hasError() ? "Invalid Username or Password" : "";
  }

}
