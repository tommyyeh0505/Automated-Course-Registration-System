import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
    public validStudentId: boolean = true;
    public editStudent: Student = new Student();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditStudentComponent>,
        public studentService: StudentService,
        @Inject(MAT_DIALOG_DATA) public data: StudentDialogData) {

    }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.editStudentForm = this.fb.group({
            studentId: new FormControl({ value: this.data.student.studentId, disabled: true }, [Validators.required]),
            studentName: new FormControl(this.data.student.studentName, [Validators.required]),
        });
        this.getStudents();
    }

    public isTakenStudentId(studentId: string) {
        studentId = studentId.trim();
        let studentIdList = this.students.map(s => s.studentId);
        this.validStudentId = studentIdList.indexOf(studentId) === -1;
    }

    public submit() {
        let studentName = this.editStudentForm.value.studentName;
        this.data.student.studentName = studentName;
    }

    async getStudents() {
        await this.studentService.getStudents().subscribe((data: Student[]) => {
            this.students = data;
        });
    }

}



