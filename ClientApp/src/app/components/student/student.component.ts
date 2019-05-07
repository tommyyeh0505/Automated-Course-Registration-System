import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTooltipModule, MatDialog } from '@angular/material';
import { Grade } from 'src/app/models/grade';
import { GradeService } from 'src/app/services/grade.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { AddCourseComponent } from '../modals/course/add/add-course.component';
import { Course } from 'src/app/models/course';
import { AddStudentComponent } from '../modals/student/add/add-student.component';
import { first } from 'rxjs/operators';

export interface StudentDialogData {
  student: Student;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'student',
  styleUrls: ['student.component.css'],
  templateUrl: 'student.component.html',
})

export class StudentComponent implements OnInit {
  displayedColumns: string[] = ['studentId', 'studentName', 'view', 'edit'];
  dataSource: MatTableDataSource<Student>;
  students: Student[] = [];
  newStudent: Student;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private studentService: StudentService,
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getStudents();
  }
  ngOnInit() {
    this.getStudents();
  }

  openAddDialog() {
    this.newStudent = new Student();
    let dialogRef = this.dialog.open(AddStudentComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        student: this.newStudent
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addStudent(this.newStudent);
      }
      this.newStudent = new Student();
    });
  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refresh() {
    this.studentService.getStudents().subscribe((data: Student[]) => {
      this.students = data;
      this.initTable(this.students);
    });
  }
  viewStudent(student: Student) {
    this.router.navigate([`/student/${student.studentId}`]);
  }

  getStudents() {
    this.studentService.getStudents().subscribe((data: Student[]) => {
      this.students = data;

      this.initTable(this.students);
    });

  }


  addStudent(student: Student) {
    this.studentService.addStudent(student).pipe(first()).subscribe((response: Response) => {
      this.refresh();
    })
  }




  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
