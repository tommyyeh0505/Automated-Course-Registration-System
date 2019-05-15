import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UpdatePassword } from 'src/app/models/updatePassword';
import { EditAccountComponent } from '../modals/account/edit/edit-account.component';
export interface ChangePassword {
  password: UpdatePassword;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  newPassword: UpdatePassword;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openPasswordDialog() {
    let dialogRef = this.dialog.open(EditAccountComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        password: this.newPassword,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.addGrade(result.grade);
      // }
      // this.newGrade = new Grade();

    });
  }

  updatePassword() {

  }

}
