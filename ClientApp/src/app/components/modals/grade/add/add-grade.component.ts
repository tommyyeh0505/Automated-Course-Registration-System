


import { Component, OnInit, Inject } from '@angular/core';



import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { Prerequisite } from 'src/app/models/prerequisite';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { StudentDialogData } from 'src/app/components/student/student.component';
import { Grade } from 'src/app/models/grade';
import { AddStudentComponent } from '../../student/add/add-student.component';
import { GradeDialogData } from 'src/app/components/class-detail/class-detail.component';
import { GradeService } from 'src/app/services/grade.service';





@Component({
    selector: 'add-grade',
    styleUrls: ['./add-grade.component.css'],
    templateUrl: './add-grade.component.html'
})



export class AddGradeComponent implements OnInit {

    public addGradeForm: FormGroup;

    public grades: Grade[] = [];

    public validStudentId: boolean = true;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddGradeComponent>,
        public gradeService: GradeService,
        @Inject(MAT_DIALOG_DATA) public data: GradeDialogData) {

    }

    ngOnInit() {
        this.createForm();
    }


    private createForm() {

        this.addGradeForm = this.fb.group({
            courseId: new FormControl({ value: this.data.grade.courseId, disabled: true }),
            crn: new FormControl({ value: this.data.grade.crn, disabled: true }),
            term: new FormControl({ value: this.data.grade.term, disabled: true }),
            studentId: new FormControl(this.data.grade.studentId, [Validators.required]),
            finalGrade: new FormControl(this.data.grade.finalGrade, [Validators.required]),

        });
        this.grades = this.data.grades;

    }

    public isTakenStudentId(studentId: string) {
        studentId = studentId.trim();
        let studentIdList = this.grades.map(g => g.studentId);
        this.validStudentId = studentIdList.indexOf(studentId) === -1;
    }




    public submit() {
        let studentId = this.addGradeForm.value.studentId;
        let finalGrade = this.addGradeForm.value.finalGrade;

        this.data.grade.studentId = studentId;
        this.data.grade.finalGrade = finalGrade;


    }


 

}



