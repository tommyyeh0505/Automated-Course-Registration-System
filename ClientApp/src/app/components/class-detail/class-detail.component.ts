import { Component, OnInit, ViewChild } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Grade } from 'src/app/models/grade';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Course } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';
import { AddCourseComponent } from '../modals/course/add/add-course.component';
import { first } from 'rxjs/operators';
import { AddGradeComponent } from '../modals/grade/add/add-grade.component';

export interface GradeDialogData {
  grade: Grade;
  grades: Grade[];
}

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit {
  grades: Grade[];
  course: Course = new Course();
  crn: string;
  term: string;
  courseCreated: boolean;
  newGrade: Grade;
  editGrade: Grade;
  displayedColumns: string[] = ['studentId', 'finalGrade', 'attempts', 'viewStudent', 'edit', 'delete'];
  dataSource: MatTableDataSource<Grade>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    public dialog: MatDialog,
    private gradeService: GradeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id.split('-');
      let courseId = id[0];
      this.crn = id[1];
      this.term = id[2];
      this.course.courseId = courseId;

      this.getGradesByKey(courseId, this.crn, this.term);

    })
  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refresh() {
    this.gradeService.getGrades().subscribe((data: Grade[]) => {
      this.grades = data;
      this.initTable(this.grades);
    });
  }

  getGradesByKey(courseId: string, crn: string, term: string) {
    this.gradeService.getGradesByKey(courseId, crn, term).subscribe((data: Grade[]) => {
      this.getCourseByCourseId(courseId);
      this.grades = data;
      this.initTable(data);
    })
  }

  getCourseByCourseId(courseId: string) {
    this.courseService.getCourse(courseId).subscribe((data: Course) => {
      this.courseCreated = true;
      this.course = data;
    }, error => {
      this.courseCreated = false;
    })
  }

  createCourse() {
    let dialogRef = this.dialog.open(AddCourseComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        course: this.course
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCourse(this.course);
      }
    });
  }

  openAddDialog() {
    this.initNewGrade();

    let dialogRef = this.dialog.open(AddGradeComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        grade: this.newGrade,
        grades: this.grades,
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.addGrade(result.grade);
      }
      this.initNewGrade();
    });

  }

  addCourse(course: Course) {
    this.courseService.addCourse(course).pipe(first()).subscribe((response: any) => {
      this.getCourseByCourseId(course.courseId);
      this.courseCreated = true;
    });
  }

  addGrade(grade: Grade) {
    this.gradeService.addGrade(grade).pipe(first()).subscribe((response: any) => {
      this.refresh();

    }, err => {

    });
  }

  initNewGrade() {
    this.newGrade = new Grade();
    this.newGrade.courseId = this.course.courseId;
    this.newGrade.crn = this.crn;
    this.newGrade.term = this.term;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
