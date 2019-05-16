import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Course } from '../../../../models/course';
import { CourseService } from 'src/app/services/course.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Prerequisite } from 'src/app/models/prerequisite';
import { CourseDialogData } from 'src/app/components/course/course.component';
import { AccountDialogData } from 'src/app/components/account/account.component';

@Component({
    selector: 'edit-account',
    styleUrls: ['./edit-account.component.css'],
    templateUrl: './edit-account.component.html'
})

export class EditAccountComponent implements OnInit {

    public editAccountForm: FormGroup

    public newPassword: string;

    public repeatNewPassword: string;

    public isPasswordValid: boolean = true;

    public matched: boolean = true;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditAccountComponent>,
        public courseService: CourseService,
        @Inject(MAT_DIALOG_DATA) public data: AccountDialogData) {
    }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.editAccountForm = this.fb.group({
            currentPassword: new FormControl(this.data.password.currentPassword, [Validators.required]),
            newPassword: new FormControl(this.data.password.newPassword, [Validators.required]),
            repeatNewPassword: new FormControl(this.data.password.newPassword, [Validators.required]),

        });
    }

    private validatePassword(value: string) {
        if (!this.isValid(value)) {
            this.isPasswordValid = false;
        } else {
            this.isPasswordValid = true
        }
        this.newPassword = value;
    }

    private repeatPassword(value: string) {
        this.repeatNewPassword = value;
        if (this.repeatNewPassword !== this.newPassword) {
            this.matched = false;
        }
        else {
            this.matched = true;
        }
    }

    private isValid(str: string) {

        return str.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/);
    }

    public submit() {
        this.data.password.newPassword = this.newPassword;
        this.data.password.currentPassword = this.editAccountForm.value.currentPassword;
    }





}



