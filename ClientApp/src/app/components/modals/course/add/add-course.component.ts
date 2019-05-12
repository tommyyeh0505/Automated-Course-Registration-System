


import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';



import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// Used for importing lists from the html.
import { Course } from '../../../../models/course';
import { CourseService } from 'src/app/services/course.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CourseDialogData } from 'src/app/components/course/course.component';
import { Prerequisite } from 'src/app/models/prerequisite';





@Component({
    selector: 'add-course',
    styleUrls: ['./add-course.component.css'],
    templateUrl: './add-course.component.html'
})



export class AddCourseComponent implements OnInit {

    public addCourseForm: FormGroup;
    courseAutoComplete = new FormControl();
    filteredCourses: Observable<Course[]>;
    public courses: Course[] = [];
    public prereqList: string[] = [];
    public validCourseId: boolean = true;
    public validPreq: boolean = true;


    public selectedPreq: string;
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddCourseComponent>,
        public courseService: CourseService,
        @Inject(MAT_DIALOG_DATA) public data: CourseDialogData) {


    }

    ngOnInit() {
        this.createForm();
    }


    private createForm() {
        this.addCourseForm = this.fb.group({
            courseId: new FormControl(this.data.course.courseId, [Validators.required]),
            passingGrade: new FormControl(65, [Validators.required, Validators.min(0), Validators.max(100)]),
        });
        this.filteredCourses = this.courseAutoComplete.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterCourses(state) : this.courses.slice())
            );
        this.courseAutoComplete.reset();
        this.courses = this.data.courses;

    }

    public isTakenCourseId(courseId: string) {
        courseId = courseId.trim();
        let courseIdList = this.courses.map(c => c.courseId);
        this.validCourseId = courseIdList.indexOf(courseId) === -1;
    }

    public selectPreq(courseId: string) {
        this.selectedPreq = courseId;
    }

    public addPrerequisite() {
        if (this.selectedPreq) {
            if (this.prereqList.indexOf(this.selectedPreq) === -1) {
                this.prereqList.push(this.selectedPreq);
                this.validPreq = true;
            }
            else {
                this.validPreq = false;
            }
        }
        this.courseAutoComplete.reset();
    }

    public removePreq(courseId: string) {
        let index = this.prereqList.indexOf(courseId);
        this.prereqList.splice(index, 1);
    }

    public submit() {
        let courseId = this.addCourseForm.value.courseId;
        let passingGrade = parseInt(this.addCourseForm.value.passingGrade);
        this.data.course.courseId = courseId;
        this.data.course.passingGrade = passingGrade;
        this.data.course.prerequisites = this.prereqList.map(e => {
            let preq = new Prerequisite();
            preq.courseId = courseId;
            preq.prerequisiteCourseId = e;
            return preq;
        })
    }


    private _filterCourses(value: string): Course[] {
        const filterValue = value.toLowerCase();
        return this.courses.filter(course => course.courseId.toLowerCase().indexOf(filterValue) === 0);
    }


}



