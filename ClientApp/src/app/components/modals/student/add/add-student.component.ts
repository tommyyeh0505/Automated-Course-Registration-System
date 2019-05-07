


import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';



import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// Used for importing lists from the html.
import { Course } from '../../../../models/course';
import { CourseService } from 'src/app/services/course.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DialogData } from 'src/app/components/course/course.component';
import { Prerequisite } from 'src/app/models/prerequisite';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { StudentDialogData } from 'src/app/components/student/student.component';





@Component({
    selector: 'add-student',
    styleUrls: ['./add-student.component.css'],
    templateUrl: './add-student.component.html'
})



export class AddStudentComponent implements OnInit {

    public addStudentForm: FormGroup;

    public students: Student[] = [];

    public validStudentId: boolean = true;
    public validPreq: boolean = true;

    public selectedPreq: string;
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddStudentComponent>,
        public studentService: StudentService,
        @Inject(MAT_DIALOG_DATA) public data: StudentDialogData) {

    }

    ngOnInit() {
        this.createForm();
    }


    private createForm() {
        this.addStudentForm = this.fb.group({
            studentId: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
        });
        this.getStudents();

    }

    public isTakenStudentId(studentId: string) {
        studentId = studentId.trim();
        let studentIdList = this.students.map(s => s.studentId);
        this.validStudentId = studentIdList.indexOf(studentId) === -1;
    }

    public selectPreq(courseId: string) {
        this.selectedPreq = courseId;
    }



    public submit() {
        let studentId = this.addStudentForm.value.studentId;
        let firstName = this.addStudentForm.value.firstName;
        let lastName = this.addStudentForm.value.lastName;
        this.data.student.studentId = studentId;
        this.data.student.studentName = firstName + ' ' + lastName;


    }
    async getStudents() {
        await this.studentService.getStudents().subscribe((data: Student[]) => {
            this.students = data;
        });
    }

}



