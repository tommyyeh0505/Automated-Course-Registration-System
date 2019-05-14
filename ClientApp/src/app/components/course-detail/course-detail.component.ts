import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course';
import { GradeService } from 'src/app/services/grade.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Class } from 'src/app/models/class';
import { Grade } from 'src/app/models/grade';
import { EditCourseComponent } from '../modals/course/edit/edit-course.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  displayedColumns: string[] = ['courseId', 'crn', 'term', 'view'];

  course: Course = new Course();
  dataSource: MatTableDataSource<Class>;
  classes: Class[] = [];
  courses: Course[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private courseService: CourseService,
    private gradeService: GradeService) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id;
      this.getCourseById(id);

    });
  }

  openEditCourseDialog() {
    console.log(this.course);

    let dialogRef = this.dialog.open(EditCourseComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        course: this.course,
        courses: this.courses
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newEditCourse = result.course;
        this.updateCourse(newEditCourse.courseId, newEditCourse);
        this.course = newEditCourse;
      }

    });
  }

  updateCourse(courseId: string, editCourse: Course) {
    this.courseService.updateCourse(courseId, editCourse).pipe(first()).subscribe((response: any) => {

      this.openSnackbar("Course successfully updated", 'success-snackbar');

    }, err => {
      this.openSnackbar("Failed to update course", 'error-snackbar');

    }
    );
  }

  openSnackbar(message: string, style: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000, verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: style
    });
  }


  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCourses() {
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;

    });
  }
  getClasses() {

    this.gradeService.getGrades().subscribe((data: Grade[]) => {
      this.classes = data.reduce((acc, cur) => {
        let c = {
          courseId: cur.courseId,
          term: cur.term,
          crn: cur.crn
        }
        if (c.courseId === this.course.courseId && acc.filter(el => el.courseId === c.courseId && el.term === c.term && el.crn === c.crn).length === 0) {
          acc.push(c);
        }
        return acc;
      }, []);
      console.log(this.classes);

      this.initTable(this.classes);
    });
  }

  getCourseById(id: string) {
    this.courseService.getCourse(id).subscribe((data: Course) => {
      this.course = data;
      this.getClasses();
      this.getCourses();
    }, err => {
      this.router.navigate(['/error']);
    }
    );
  }



  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
