import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { Grade } from 'src/app/models/grade';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { GradeService } from 'src/app/services/grade.service';
import { AddStudentGradeComponent } from '../modals/student-grade/add/add-student-grade.component';
import { first } from 'rxjs/operators';
import { EditStudentGradeComponent } from '../modals/student-grade/edit/edit-student-grade.component';
import { AddStudentComponent } from '../modals/student/add/add-student.component';
import { EditStudentComponent } from '../modals/student/edit/edit-student.component';


@Component({
  selector: 'student-detail',
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
  isCreated: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private gradeService: GradeService,
    private studentService: StudentService,
    public snackbar: MatSnackBar) { }

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
      }
      this.editGrade = new Grade();
    });
  }

  openEditStudentDialog() {


    let dialogRef = this.dialog.open(EditStudentComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        student: this.student,
        students: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newEditStudent = result.student;
        this.updateStudent(newEditStudent.studentId, newEditStudent);
        this.student = newEditStudent;
      }

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


  updateStudent(studentId: string, student: Student) {
    this.studentService.updateStudent(studentId, student).pipe(first()).subscribe((response: any) => {
      this.openSnackbar(`Student #${studentId} Successfully Updated`, 'success-snackbar');
      this.refresh();
    }, err => {
      this.openSnackbar(`Failed To Update Student #${studentId}`, 'error-snackbar');
    });
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
      this.isCreated = true;
    }, err => {
      // this.router.navigate(['/error']);
      this.student.studentId = studentId;
      this.isCreated = false;
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

  addStudent(student: Student) {
    this.studentService.addStudent(student).pipe(first()).subscribe((response: Response) => {
      this.openSnackbar("New Student Successfully Created", 'success-snackbar');
      this.isCreated = true;
      this.refresh();
    }, err => {
      this.openSnackbar("Failed To Create New Student", 'error-snackbar');
    })
  }

  openSnackbar(message: string, style: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000, verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: style
    });
  }

  createStudent() {
    let dialogRef = this.dialog.open(AddStudentComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        student: this.student,
        students: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addStudent(result.student);
      }
    });
  }
}
