import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgModule } from '@angular/core';
import { Grade } from 'src/app/models/grade';
import { GradeService } from 'src/app/services/grade.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';






/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'grade',
  styleUrls: ['grade.component.css'],
  templateUrl: 'grade.component.html',
})

export class GradeComponent implements OnInit {
  displayedColumns: string[] = ['gradeId', 'studentId', 'finalGrade', 'attempts'];
  dataSource: MatTableDataSource<Grade>;
  grades: Grade[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private gradeServce: GradeService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    // Create 100 users


    // Assign the data to the data source for the table to render


  }

  getGrades() {
    this.gradeServce.getGrades().subscribe((data: Grade[]) => {

      this.grades = data;
      this.dataSource = new MatTableDataSource(this.grades);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  ngOnInit() {
    this.getGrades();

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

