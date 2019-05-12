import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { Grade } from 'src/app/models/grade';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AddGradeComponent } from '../modals/grade/add/add-grade.component';
import { GradeService } from 'src/app/services/grade.service';
import { AddStudentGradeComponent } from '../modals/student-grade/add/add-student-grade.component';
import { first } from 'rxjs/operators';
import { EditStudentGradeComponent } from '../modals/student-grade/edit/edit-student-grade.component';
import { AddStudentComponent } from '../modals/student/add/add-student.component';


@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student = new Student();
  students: Student[];
  grades: Grade[];
  studentGrades: Grade[];
  newGrade: Grade;
  editGrade: Grade;
  displayedColumns: string[] = ['courseId', 'crn', 'term', 'finalGrade', 'rawGrade', 'attempts', 'edit', 'delete'];
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
      if (result) {
        this.addGrade(result.grade);
      }
      this.newGrade = new Grade();

    });
  }

  openEditDialog(grade: Grade) {
    this.editGrade = grade;
    let dialogRef = this.dialog.open(EditStudentGradeComponent, {
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
        // console.log(result);
      }

      this.editGrade = new Grade();
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
