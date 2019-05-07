import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { Grade } from 'src/app/models/grade';
import { GradeService } from 'src/app/services/grade.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';



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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private studentService: StudentService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.getStudents();
  }
  ngOnInit() {
    this.getStudents();
  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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




  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
