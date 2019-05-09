import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { Grade } from 'src/app/models/grade';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';


@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student = new Student();
  studentGrades: Grade[];
  newGrade: Grade;
  editGrade: Grade;
  displayedColumns: string[] = ['courseId', 'crn', 'term', 'finalGrade', 'attempts', 'view', 'edit', 'delete'];
  dataSource: MatTableDataSource<Grade>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private studentService: StudentService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id;
      this.getStudentById(id);
    })
  }
  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.initNewGrade();
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
    this.studentService.getStudentGrades(studentId).subscribe((data: Grade[]) => {
      console.log(data);

      this.studentGrades = data;
    })
  }

}
