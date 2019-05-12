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
import { EditGradeComponent } from '../modals/grade/edit/edit-grade.component';

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
  courses: Course[];
  course: Course = new Course();
  courseId: string;
  crn: string;
  term: string;
  courseCreated: boolean;
  newGrade: Grade;
  editGrade: Grade;
  displayedColumns: string[] = ['studentId', 'finalGrade', 'rawGrade', 'attempts', 'viewStudent', 'edit', 'delete'];
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
      this.courseId = id[0]
      this.crn = id[1];
      this.term = id[2];
      this.course.courseId = this.courseId;
      this.getCourses();

      this.getGradesByKey(this.courseId, this.crn, this.term);

    })
  }

  initTable(data) {

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.initNewGrade();
  }

  refresh() {
    this.getGradesByKey(this.courseId, this.crn, this.term);
  }

  getGradesByKey(courseId: string, crn: string, term: string) {
    this.gradeService.getGradesByKey(courseId, crn, term).subscribe((data: Grade[]) => {
      this.getCourseByCourseId(courseId);
      this.grades = data;

      this.initTable(data);

    }, err => {
      this.router.navigate(['/error']);
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
        course: this.course,
        courses: this.courses
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
      if (result) {
        this.addGrade(result.grade);
      }
    });
  }

  openEditDialog(grade: Grade) {
    this.editGrade = grade;

    let dialogRef = this.dialog.open(EditGradeComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        grade: this.editGrade,
        grades: this.grades
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateGrade(result.grade.gradeId, result.grade);
      }
    });
  }

  getCourses() {
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;

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

  updateGrade(gradeId: number, grade: Grade) {
    this.gradeService.updateGrade(gradeId, grade).pipe(first()).subscribe((response: Response) => {
      this.refresh();
    })

  }

  deleteGrade(grade: Grade) {
    this.gradeService.deleteGrade(grade);
    let itemIndex = this.dataSource.data.findIndex(obj => obj.gradeId === grade.gradeId);
    this.dataSource.data.splice(itemIndex, 1);
    this.grades = this.dataSource.data;
    this.initTable(this.dataSource.data);
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
