import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map, first } from 'rxjs/operators';
import { Waitlist } from 'src/app/models/waitlist';
import { WaitlistDialogData } from 'src/app/components/waitlist/waitlist.component';
import { Course } from 'src/app/models/course';
import { Observable } from 'rxjs';
import { CourseService } from 'src/app/services/course.service';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { WaitlistDetail } from 'src/app/components/waitlist-detail/waitlist-detail.component';
import { Eligible } from 'src/app/models/eligible';





@Component({
    selector: 'detail-waitlist',
    styleUrls: ['./detail-waitlist.component.css'],
    templateUrl: './detail-waitlist.component.html'
})



export class DetailWaitlistComponent implements OnInit {

    public eligible: Eligible;




    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DetailWaitlistComponent>,
        public courseService: CourseService,
        public studentService: StudentService,
        @Inject(MAT_DIALOG_DATA) public data: WaitlistDetail) {
    }

    ngOnInit() {
        this.eligible = this.data.detail;
    }

    close() {
        this.dialogRef.close();
    }


    private createForm() {



    }





}



