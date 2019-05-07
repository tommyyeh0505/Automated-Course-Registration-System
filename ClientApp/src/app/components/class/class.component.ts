import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { Grade } from 'src/app/models/grade';
import { GradeService } from 'src/app/services/grade.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';



/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'class',
  styleUrls: ['class.component.css'],
  templateUrl: 'class.component.html',
})

export class ClassComponent implements OnInit {
  displayedColumns: string[] = ['gradeId', 'studentId', 'finalGrade', 'attempts', 'delete'];
  dataSource: MatTableDataSource<Grade>;
  grades: Grade[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private gradeServce: GradeService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.getGrades();
    // Create 100 users


    // Assign the data to the data source for the table to render


  }
  ngOnInit() {
    this.getGrades();
  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getGrades() {
    this.gradeServce.getGrades().subscribe((data: Grade[]) => {
      this.grades = data;
      this.initTable(this.grades);
    });

  }


  deleteGrade(grade: Grade) {
    this.gradeServce.deleteGrade(grade);
    let itemIndex = this.dataSource.data.findIndex(obj => obj.gradeId === grade.gradeId);
    this.dataSource.data.splice(itemIndex, 1);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
