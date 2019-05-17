import { OnInit, Component } from '@angular/core';
import { UpdatePassword } from 'src/app/models/updatePassword';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';


@Component({
    selector: 'reset',
    templateUrl: 'resetPassword.component.html',
  })

export class ResetPasswordComponent implements OnInit{
    constructor(private accountService:AccountService,
        private router:Router){
    }
    ngOnInit(): void {
    let password = localStorage.getItem('cGFzc3dvcmQ=');
    let currentPassword = atob(password);
    let updatePassword = new UpdatePassword();
    updatePassword.username = 'admin';
    updatePassword.currentPassword = currentPassword;
    updatePassword.newPassword = 'P@$$w0rd';
   
    this.accountService.updatePassword(updatePassword).subscribe((res: any) => {
        console.log(res);   
        this.router.navigate(['/']);
      }, err => {
  
      });


    }

}