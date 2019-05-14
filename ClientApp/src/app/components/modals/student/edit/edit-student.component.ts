import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { StudentDialogData } from 'src/app/components/student/student.component';


@Component({
    selector: 'edit-student',
    styleUrls: ['./edit-student.component.css'],
    templateUrl: './edit-student.component.html'
})
export class EditStudentComponent implements OnInit {

    public editStudentForm: FormGroup;
    public students: Student[] = [];
    public editStudent: Student = new Student();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditStudentComponent>,
        public studentService: StudentService,
        public snackbar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: StudentDialogData) {

    }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.editStudentForm = this.fb.group({
            studentId: new FormControl({ value: this.data.student.studentId, disabled: true }),
            studentName: new FormControl(this.data.student.studentName),
        });
        this.students = this.data.students;
    }


    public submit() {
        let studentName = this.editStudentForm.value.studentName;
        this.data.student.studentName = studentName;
        this.openSnackbar(`Student #${this.data.student.studentId} Successfully Updated`, 'success-snackbar');
    }

    openSnackbar(message: string, style: string) {
        this.snackbar.open(message, 'Close', {
            duration: 3000, verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: style
        });
    }


}



