import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { Course } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { AddCourseComponent } from '../modals/course/add/add-course.component';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { EditCourseComponent } from '../modals/course/edit/edit-course.component';

export interface DialogData {
  course: Course;
}
/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'course',
  styleUrls: ['course.component.css'],
  templateUrl: 'course.component.html',
})



export class CourseComponent implements OnInit {
  displayedColumns: string[] = ['courseId', 'passingGrade', 'prerequisite', 'view', 'edit', 'delete'];
  dataSource: MatTableDataSource<Course>;
  courses: Course[] = [];
  newCourse: Course = new Course();
  editCourse: Course = new Course();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private courseService: CourseService,
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getCourses();
    // Create 100 users


    // Assign the data to the data source for the table to render


  }
  ngOnInit() {
    this.getCourses();
  }


  openAddDialog() {
    this.newCourse = new Course();
    let dialogRef = this.dialog.open(AddCourseComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        course: this.newCourse
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCourse(this.newCourse);
      }
      this.newCourse = new Course();
    });
  }

  openEditDialog(course: Course) {
    this.editCourse = course;
    console.log(this.editCourse);
    let dialogRef = this.dialog.open(EditCourseComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        course: this.editCourse
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.addCourse(this.newCourse);
      // }
      this.editCourse = new Course();
    });
  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  viewCourse(course: Course) {
    this.router.navigate(['/course/' + course.courseId]);
  }
  getCourses() {
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;
      this.initTable(this.courses);
    });
  }

  getCourse(course: Course) {

  }

  addCourse(course: Course) {
    this.courseService.addCourse(course).pipe(first()).subscribe((response: any) => {
      console.log(response)
      this.dataSource.data.push(response);
      this.initTable(this.dataSource.data);
    });
  }


  deleteCourse(course: Course) {
    this.courseService.deleteCourse(course);
    let itemIndex = this.dataSource.data.findIndex(obj => obj.courseId === course.courseId);
    this.dataSource.data.splice(itemIndex, 1);
    this.initTable(this.dataSource.data);
  }




  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
