


import { Component, OnInit, Inject } from '@angular/core';



import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map, first } from 'rxjs/operators';
import { Prerequisite } from 'src/app/models/prerequisite';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { StudentDialogData } from 'src/app/components/student/student.component';
import { Grade } from 'src/app/models/grade';
import { AddStudentComponent } from '../../student/add/add-student.component';
import { GradeDialogData } from 'src/app/components/class-detail/class-detail.component';
import { GradeService } from 'src/app/services/grade.service';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';





@Component({
    selector: 'add-studemt-grade',
    styleUrls: ['./add-student-grade.component.css'],
    templateUrl: './add-student-grade.component.html'
})



export class AddStudentGradeComponent implements OnInit {

    public addStudentGradeForm: FormGroup;
    courseAutoComplete = new FormControl();
    filteredCourses: Observable<Course[]>;
    public grades: Grade[] = [];
    public courses: Course[] = [];
    public validGrade: boolean = true;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddStudentGradeComponent>,
        public gradeService: GradeService,
        public courseService: CourseService,
        @Inject(MAT_DIALOG_DATA) public data: GradeDialogData) {

    }

    ngOnInit() {
        this.createForm();
        console.log(this.filteredCourses);
    }


    private createForm() {
        this.addStudentGradeForm = this.fb.group({
            courseId: new FormControl(this.data.grade.courseId, [Validators.required]),
            crn: new FormControl(this.data.grade.crn, [Validators.required]),
            term: new FormControl(this.data.grade.term, [Validators.required]),
            studentId: new FormControl({ value: this.data.grade.studentId, disabled: true }),
            finalGrade: new FormControl(this.data.grade.finalGrade, [Validators.required]),
        });

        this.courseService.getCourses().pipe(first()).subscribe((data: Course[]) => {
            this.courses = data;
            this.filteredCourses = this.courseAutoComplete.valueChanges
                .pipe(
                    startWith(''),
                    map(state => state ? this._filterCourses(state) : this.courses.slice())
                );
            this.courseAutoComplete.reset();
            this.grades = this.data.grades;

        });



    }

    public isTakenClass(courseId: string, crn: string, term: string) {
        // studentId = studentId.trim();
        // let studentIdList = this.grades.map(g => g.studentId);
        // this.validStudentId = studentIdList.indexOf(studentId) === -1;
        this.validGrade = this.grades.filter(g => g.courseId === courseId && g.crn === crn && g.term === term).length === 0;

    }




    public submit() {
        // let studentId = this.addGradeForm.value.studentId;
        // let finalGrade = this.addGradeForm.value.finalGrade;

        // this.data.grade.studentId = studentId;
        // this.data.grade.finalGrade = finalGrade;
        console.log(this.data.grade);

    }

    private _filterCourses(value: string): Course[] {
        const filterValue = value.toLowerCase();
        return this.courses.filter(course => course.courseId.toLowerCase().indexOf(filterValue) === 0);
    }




}



