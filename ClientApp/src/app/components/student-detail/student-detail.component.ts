import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { Grade } from 'src/app/models/grade';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AddGradeComponent } from '../modals/grade/add/add-grade.component';
import { GradeService } from 'src/app/services/grade.service';
import { AddStudentGradeComponent } from '../modals/student-grade/add/add-student-grade.component';


@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student = new Student();
  grades: Grade[];
  studentGrades: Grade[];

  newGrade: Grade;
  editGrade: Grade;
  displayedColumns: string[] = ['courseId', 'crn', 'term', 'finalGrade', 'attempts', 'edit', 'delete'];
  dataSource: MatTableDataSource<Grade>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private gradeService: GradeService,
    private studentService: StudentService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id;
      this.getStudentById(id);
    })
  }

  openAddDialog() {
    this.newGrade = new Grade();
    this.newGrade.studentId = this.student.studentId;
    let dialogRef = this.dialog.open(AddStudentGradeComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        grade: this.newGrade,
        grades: this.grades,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.addGrade(result.grade);
      // }
    });
  }
  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  refresh() {
    this.gradeService.getGrades().subscribe((data: Grade[]) => {
      this.grades = data;
      this.studentGrades = data.filter(e => e.studentId === this.student.studentId);
      this.initTable(this.studentGrades);
    })

  }

  getStudentById(studentId: string) {
    this.studentService.getStudent(studentId).subscribe((data: Student) => {
      this.student = data;
      this.getStudentsGrades(studentId);
    }, err => {
      this.router.navigate(['/error']);
    })
  }

  getStudentsGrades(studentId: string) {
    this.gradeService.getGrades().subscribe((data: Grade[]) => {
      this.grades = data;
      this.studentGrades = data.filter(e => e.studentId === this.student.studentId);

      this.initTable(this.studentGrades);
    })
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
