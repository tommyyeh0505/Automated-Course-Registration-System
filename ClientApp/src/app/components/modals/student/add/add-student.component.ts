


import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';



import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
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
            studentId: new FormControl(this.data.student.studentId, [Validators.required]),
            studentName: new FormControl(this.data.student.studentName, [Validators.required]),

        });
        this.students = this.data.students;

    }

    public isTakenStudentId(studentId: string) {
        studentId = studentId.trim();
        let studentIdList = this.students.map(s => s.studentId);
        this.validStudentId = studentIdList.indexOf(studentId) === -1;
    }




    public submit() {
        let studentId = this.addStudentForm.value.studentId;
        let studentName = this.addStudentForm.value.studentName;

        this.data.student.studentId = studentId;
        this.data.student.studentName = studentName;


    }


}



