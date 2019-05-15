import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UpdatePassword } from 'src/app/models/updatePassword';
import { EditPasswordComponent } from '../modals/account/edit/edit-course.component';
export interface ChangePassword {
  newPassword: UpdatePassword;
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
    let dialogRef = this.dialog.open(EditPasswordComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        newPassword: this.newPassword,
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
