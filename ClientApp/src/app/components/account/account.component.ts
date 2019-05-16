import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UpdatePassword } from 'src/app/models/updatePassword';
import { EditAccountComponent } from '../modals/account/edit/edit-account.component';
import { AccountService } from 'src/app/services/account.service';
export interface AccountDialogData {
  password: UpdatePassword;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  newPassword: UpdatePassword;
  constructor(private dialog: MatDialog,
    private accountService: AccountService,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  openPasswordDialog() {
    this.newPassword = new UpdatePassword();
    this.newPassword.username = 'admin';
    let dialogRef = this.dialog.open(EditAccountComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        password: this.newPassword,
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.updatePassword(result.password);
      }

      this.newPassword = new UpdatePassword();
    });
  }

  updatePassword(password: UpdatePassword) {
    this.accountService.updatePassword(password).subscribe((res: any) => {
      this.openSnackbar("Password successfully updated", 'success-snackbar');

    }, err => {
      this.openSnackbar("Failed to change password", 'error-snackbar');

    });
  }

  openSnackbar(message: string, style: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000, verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: style
    });
  }

}
