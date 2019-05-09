import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { StudentDialogData } from 'src/app/components/student/student.component';
import { Grade } from 'src/app/models/grade';
import { EditStudentComponent } from '../../student/edit/edit-student.component';
import { templateJitUrl } from '@angular/compiler';
import { GradeService } from 'src/app/services/grade.service';
import { GradeDialogData } from 'src/app/components/class-detail/class-detail.component';


@Component({
    selector: 'edit-grade',
    styleUrls: ['./edit-grade.component.css'],
    templateUrl: './edit-grade.component.html'
})
export class EditGradeComponent implements OnInit {

    public editGradeForm: FormGroup;
    public grades: Grade[] = [];
    public validStudentId: boolean = true;
    public editGrade: Grade = new Grade();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditGradeComponent>,
        public gradeService: GradeService,
        @Inject(MAT_DIALOG_DATA) public data: GradeDialogData) {

    }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.editGradeForm = this.fb.group({
            courseId: new FormControl({ value: this.data.grade.courseId, disabled: true }),
            crn: new FormControl({ value: this.data.grade.crn, disabled: true }),
            term: new FormControl({ value: this.data.grade.term, disabled: true }),
            studentId: new FormControl(this.data.grade.studentId, [Validators.required]),
            finalGrade: new FormControl(this.data.grade.finalGrade, [Validators.required]),
            attempts: new FormControl(this.data.grade.attempts, [Validators.required]),
        });
        this.grades = this.data.grades;
    }

    public isTakenStudentId(studentId: string) {
        studentId = studentId.trim();
        let studentIdList = this.grades.map(g => g.studentId);
        this.validStudentId = studentIdList.indexOf(studentId) === -1;
    }

    public submit() {
        let studentId = this.editGradeForm.value.studentId;
        let finalGrade = this.editGradeForm.value.finalGrade;
        let attempts = this.editGradeForm.value.attempts;
        this.data.grade.studentId = studentId;
        this.data.grade.finalGrade = finalGrade;
        this.data.grade.attempts = attempts;
    }



}



