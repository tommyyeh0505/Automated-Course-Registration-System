import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map, first } from 'rxjs/operators';
import { Grade } from 'src/app/models/grade';
import { GradeDialogData } from 'src/app/components/class-detail/class-detail.component';
import { GradeService } from 'src/app/services/grade.service';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';





@Component({
    selector: 'add-student-grade',
    styleUrls: ['./add-student-grade.component.css'],
    templateUrl: './add-student-grade.component.html'
})



export class AddStudentGradeComponent implements OnInit {

    public addStudentGradeForm: FormGroup;
    courseAutoComplete = new FormControl();
    filteredCourses: Observable<Course[]>;
    courseId: string;
    crn: string;
    term: string;
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
    }


    private createForm() {
        this.addStudentGradeForm = this.fb.group({
            crn: new FormControl(this.data.grade.crn, [Validators.required]),
            term: new FormControl(this.data.grade.term, [Validators.required]),
            studentId: new FormControl({ value: this.data.grade.studentId, disabled: true }),
            finalGrade: new FormControl(this.data.grade.finalGrade, [Validators.required, Validators.min(0), Validators.max(100)]),
        });

        this.courseService.getCourses().pipe(first()).subscribe((data: Course[]) => {
            this.courses = data;
            this.courseAutoComplete = new FormControl(this.data.grade.courseId, [Validators.required])
            this.filteredCourses = this.courseAutoComplete.valueChanges
                .pipe(
                    startWith(''),
                    map(state => state ? this._filterCourses(state) : this.courses.slice())
                );



            this.grades = this.data.grades;

        });



    }

    public isTakenClass(courseId: string, crn: string, term: string) {
        this.validGrade = this.grades.filter(g => g.courseId === courseId && g.crn === crn && g.term === term && g.studentId === this.data.grade.studentId).length === 0;
    }

    public chooseCourseId(courseId: string) {
        this.courseId = courseId;
        this.isTakenClass(this.courseId, this.crn, this.term);
    }

    public chooseCRN(crn: string) {
        this.crn = crn;
        this.isTakenClass(this.courseId, this.crn, this.term);
    }

    public chooseTerm(term: string) {
        this.term = term;
        this.isTakenClass(this.courseId, this.crn, this.term);
    }


    public checkCourseId() {
        if (!this.courseId || this.courseId !== this.courseAutoComplete.value) {
            // this.courseAutoComplete.setValue(null);
            // this.courseId = '';
            return false;
        }
        return true;
    }


    public submit() {

        if (!this.courseId) {
            this.courseId = this.courseAutoComplete.value;
        }
        this.data.grade.courseId = this.courseId;
        this.data.grade.crn = this.crn;
        this.data.grade.term = this.term;
        this.data.grade.finalGrade = this.addStudentGradeForm.value.finalGrade;



    }

    private _filterCourses(value: string): Course[] {
        const filterValue = value.toLowerCase();
        return this.courses.filter(course => course.courseId.toLowerCase().indexOf(filterValue) === 0);
    }




}



