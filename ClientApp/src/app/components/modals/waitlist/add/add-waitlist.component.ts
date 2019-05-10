



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
import { Waitlist } from 'src/app/models/waitlist';
import { WaitlistDialogData } from 'src/app/components/waitlist/waitlist.component';
import { Course } from 'src/app/models/course';
import { Observable } from 'rxjs';
import { CourseService } from 'src/app/services/course.service';





@Component({
    selector: 'add-waitlist',
    styleUrls: ['./add-waitlist.component.css'],
    templateUrl: './add-waitlist.component.html'
})



export class AddWaitlistComponent implements OnInit {

    public addWaitlistForm: FormGroup;

    public waitlists: Waitlist[] = [];

    private courseId: string;

    private crn: string;

    private term: string;

    private studentId: string;

    public validWaitlist: boolean = true;


    public courses: Course[];

    courseAutoComplete = new FormControl();
    filteredCourses: Observable<Course[]>;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddWaitlistComponent>,
        public courseService: CourseService,
        @Inject(MAT_DIALOG_DATA) public data: WaitlistDialogData) {
    }

    ngOnInit() {
        this.createForm();
    }


    private createForm() {

        this.addWaitlistForm = this.fb.group({
            courseId: new FormControl(this.data.waitlist.courseId, [Validators.required]),
            crn: new FormControl(this.data.waitlist.crn, [Validators.required]),
            term: new FormControl(this.data.waitlist.term, [Validators.required]),
            studentId: new FormControl(this.data.waitlist.studentId, [Validators.required]),
        });


        this.courseService.getCourses().pipe(first()).subscribe((data: Course[]) => {
            this.courses = data;
            this.courseAutoComplete = new FormControl(this.data.waitlist.courseId, [Validators.required])
            this.filteredCourses = this.courseAutoComplete.valueChanges
                .pipe(
                    startWith(''),
                    map(state => state ? this._filterCourses(state) : this.courses.slice())
                );
            this.waitlists = this.data.waitlists;

        });





    }



    public isTakenClass(courseId: string, crn: string, term: string, studentId: string) {
        this.validWaitlist = this.waitlists.filter(g => g.courseId === courseId && g.crn === crn && g.term === term && g.studentId === studentId).length === 0;
        console.log({ courseId, crn, term, studentId });
    }

    public chooseCourseId(courseId: string) {
        this.courseId = courseId;
        this.isTakenClass(this.courseId, this.crn, this.term, this.studentId);

    }

    public chooseCRN(crn: string) {
        this.crn = crn;
        this.isTakenClass(this.courseId, this.crn, this.term, this.studentId);
    }

    public chooseTerm(term: string) {
        this.term = term;
        this.isTakenClass(this.courseId, this.crn, this.term, this.studentId);
    }

    public chooseStudentId(studentId: string) {
        this.studentId = studentId;
        this.isTakenClass(this.courseId, this.crn, this.term, this.studentId);
    }


    public submit() {
        // let studentId = this.addGradeForm.value.studentId;
        // let finalGrade = this.addGradeForm.value.finalGrade;

        // this.data.grade.studentId = studentId;
        // this.data.grade.finalGrade = finalGrade;


    }

    private _filterCourses(value: string): Course[] {
        const filterValue = value.toLowerCase();
        return this.courses.filter(course => course.courseId.toLowerCase().indexOf(filterValue) === 0);
    }




}



