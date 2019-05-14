import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTooltipModule, MatSnackBar } from '@angular/material';
import { Course } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { AddCourseComponent } from '../modals/course/add/add-course.component';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { EditCourseComponent } from '../modals/course/edit/edit-course.component';

export interface CourseDialogData {
  course: Course;
  courses: Course[];
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
    public snackbar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {



  }
  ngOnInit() {
    this.getCourses();
  }


  openSnackbar(message: string, style: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000, verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: style
    });
  }

  openAddDialog() {
    this.newCourse = new Course();
    let dialogRef = this.dialog.open(AddCourseComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        course: this.newCourse,
        courses: this.courses
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

    let dialogRef = this.dialog.open(EditCourseComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        course: this.editCourse,
        courses: this.courses
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newEditCourse = result.course;
        this.updateCourse(newEditCourse.courseId, newEditCourse);

      }
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
      this.initTable(data);
    });
  }



  addCourse(course: Course) {
    this.courseService.addCourse(course).pipe(first()).subscribe((response: any) => {
      this.refresh();
      this.openSnackbar("New Course Successfully Created", 'success-snackbar');

    }, err => {
      this.openSnackbar("Failed To Create New Course", 'error-snackbar');

    });
  }

  updateCourse(courseId: string, editCourse: Course) {
    this.courseService.updateCourse(courseId, editCourse).pipe(first()).subscribe((response: any) => {
      this.refresh();
      this.openSnackbar("Course Successfully Updated", 'success-snackbar');

    }, err => {
      this.openSnackbar("Failed To Update Course", 'error-snackbar');

    }
    );
  }
  refresh() {
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;
      this.initTable(this.courses);
    });
  }

  deleteCourse(course: Course) {
    this.courseService.deleteCourse(course);
    this.openSnackbar(`Course Successfully Deleted`, 'success-snackbar');
    let itemIndex = this.dataSource.data.findIndex(obj => obj.courseId === course.courseId);
    this.dataSource.data.splice(itemIndex, 1);
    this.courses = this.dataSource.data;
    this.initTable(this.dataSource.data);
  }



  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
