import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Course } from '../../../../models/course';
import { CourseService } from 'src/app/services/course.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Prerequisite } from 'src/app/models/prerequisite';
import { CourseDialogData } from 'src/app/components/course/course.component';





@Component({
    selector: 'edit-course',
    styleUrls: ['./edit-course.component.css'],
    templateUrl: './edit-course.component.html'
})



export class EditCourseComponent implements OnInit {

    public editCourseForm: FormGroup;
    courseAutoComplete = new FormControl();
    filteredCourses: Observable<Course[]>;
    public courses: Course[] = [];
    public prereqList: string[] = [];
    public validCourseId: boolean = true;
    public validPreq: boolean = true;
    public selectedPreq: string;
    public editCourse: Course = new Course();
    checkPreqId: boolean = true;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditCourseComponent>,
        public courseService: CourseService,
        @Inject(MAT_DIALOG_DATA) public data: CourseDialogData) {
    }

    ngOnInit() {
        this.createForm();

    }

    private createForm() {
        this.editCourseForm = this.fb.group({
            courseId: new FormControl({ value: this.data.course.courseId, disabled: true }),
            passingGrade: new FormControl(this.data.course.passingGrade, [Validators.required, Validators.min(0), Validators.max(100)]),

        });
        this.courses = this.data.courses.filter(c => c.courseId !== this.data.course.courseId);
        this.filteredCourses = this.courseAutoComplete.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterCourses(state) : this.courses.slice())
            );
        this.courseAutoComplete.reset();
        this.prereqList = this.data.course.prerequisites.map(c => c.prerequisiteCourseId);

    }

    public isTakenCourseId(courseId: string) {
        if (courseId === this.data.course.courseId) {
            return false;
        }
        courseId = courseId.trim();
        let courseIdList = this.courses.map(c => c.courseId);
        this.validCourseId = courseIdList.indexOf(courseId) === -1;
    }


    public selectPreq(courseId: string) {
        this.selectedPreq = courseId;

    }

    public addPrerequisite() {
        if (this.selectedPreq) {
            if (this.prereqList.indexOf(this.selectedPreq) === -1 && this.selectedPreq !== this.data.course.courseId) {
                this.prereqList.push(this.selectedPreq);
                this.validPreq = true;
                this.checkPreqId = true;
            }
            else {
                this.validPreq = false;

            }


        }
        this.selectedPreq = '';
        this.courseAutoComplete.reset();
    }

    public removePreq(courseId: string) {
        let index = this.prereqList.indexOf(courseId);
        this.prereqList.splice(index, 1);
    }

    public submit() {
        let passingGrade = parseInt(this.editCourseForm.value.passingGrade);
        this.editCourse.courseId = this.data.course.courseId;
        this.editCourse.passingGrade = passingGrade;
        this.editCourse.prerequisites = this.prereqList.map(e => {
            let preq = new Prerequisite();
            preq.courseId = this.data.course.courseId;
            preq.prerequisiteCourseId = e;
            return preq;
        })

        this.data.course = this.editCourse;
    }




    private _filterCourses(value: string): Course[] {
        const filterValue = value.toLowerCase();
        return this.courses.filter(course => course.courseId.toLowerCase().indexOf(filterValue) === 0);
    }


}



