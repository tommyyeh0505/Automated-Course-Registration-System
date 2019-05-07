


import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';



import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// Used for importing lists from the html.
import { Course } from '../../../../models/course';





@Component({
    selector: 'add-course',
    styleUrls: ['./add-course.component.css'],
    templateUrl: './add-course.component.html'
})



export class AddCourseComponent implements OnInit {

    public addCourseForm: FormGroup;



    // // Used on form html.
    // public countries = countries;



    // public formErrors = {
    //     first_name: '',
    //     last_name: '',
    //     user_name: '',
    //     country: '',
    // };



    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddCourseComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Course) { }

    // Conditional that monitors testing for unique name by service.


    ngOnInit() {
        this.createForm();
        // Set the initial user name validation trigger to false - no message.

    }


    // // The reactive model that is bound to the form.

    private createForm() {
        this.addCourseForm = this.fb.group({

            courseId: new FormControl('', [Validators.required]),
            passingGrade: new FormControl('', [Validators.required]),

        });
    }







    // This runs if inDatabase = true shows a match.  
    // See template and subscription in constructor.




}



