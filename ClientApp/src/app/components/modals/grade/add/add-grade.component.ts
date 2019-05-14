import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Grade } from 'src/app/models/grade';
import { GradeDialogData } from 'src/app/components/class-detail/class-detail.component';
import { GradeService } from 'src/app/services/grade.service';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/models/student';
import { first } from 'rxjs/operators';





@Component({
    selector: 'add-grade',
    styleUrls: ['./add-grade.component.css'],
    templateUrl: './add-grade.component.html'
})



export class AddGradeComponent implements OnInit {

    public addGradeForm: FormGroup;

    public grades: Grade[] = [];

    public validStudentId: boolean = true;

    curStudentId: string;

    students: Student[] = [];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddGradeComponent>,
        public studentService: StudentService,
        public gradeService: GradeService,
        public dialog: MatDialog,
        public snackbar: MatSnackBar,
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
            finalGrade: new FormControl(this.data.grade.finalGrade, [Validators.required, Validators.min(0), Validators.max(100)]),
            rawGrade: new FormControl(this.data.grade.rawGrade)
        });
        this.grades = this.data.grades;
        this.getStudents();

    }

    public isTakenStudentId(studentId: string) {
        studentId = studentId.trim();
        this.curStudentId = studentId;
        let studentIdList = this.grades.map(g => g.studentId);
        this.validStudentId = studentIdList.indexOf(studentId) === -1;
    }


    public isNewStudent() {
        return this.students.map(e => e.studentId).indexOf(this.curStudentId) === -1;
    }



    getStudents() {
        this.studentService.getStudents().subscribe((data: Student[]) => {
            this.students = data;
        });

    }



    addStudent(student: Student) {
        this.studentService.addStudent(student).pipe(first()).subscribe((response: Response) => {
            this.openSnackbar("New Student Successfully Created", 'success-snackbar');

        }, err => {
            this.openSnackbar("Failed To Create New Student", 'error-snackbar');
        })
    }

    openSnackbar(message: string, style: string) {
        this.snackbar.open(message, 'Close', {
            duration: 3000, verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: style
        });
    }

    public submit() {
        if (this.isNewStudent()) {
            let newStudent = new Student();
            newStudent.studentId = this.curStudentId;
            this.addStudent(newStudent);
        }

        let studentId = this.addGradeForm.value.studentId;
        let finalGrade = this.addGradeForm.value.finalGrade;
        let rawGrade = this.addGradeForm.value.rawGrade;
        this.data.grade.studentId = studentId;
        this.data.grade.finalGrade = finalGrade;
        this.data.grade.rawGrade = rawGrade;


    }




}



