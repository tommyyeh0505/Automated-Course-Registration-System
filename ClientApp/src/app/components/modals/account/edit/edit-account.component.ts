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

    public isPasswordValid: boolean;

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
        });
    }








}



