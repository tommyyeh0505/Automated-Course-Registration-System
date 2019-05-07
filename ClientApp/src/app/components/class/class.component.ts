import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { Grade } from 'src/app/models/grade';
import { GradeService } from 'src/app/services/grade.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Class } from 'src/app/models/class';



/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'class',
  styleUrls: ['class.component.css'],
  templateUrl: 'class.component.html',
})

export class ClassComponent implements OnInit {
  displayedColumns: string[] = ['courseId', 'crn', 'term', 'view'];
  dataSource: MatTableDataSource<Class>;
  classes: Class[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private gradeService: GradeService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.getClasses();
  }
  ngOnInit() {
    this.getClasses();
  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getClasses() {
    this.gradeService.getGrades().subscribe((data: Grade[]) => {
      this.classes = data.reduce((acc, cur) => {
        let c = {
          courseId: cur.courseId,
          term: cur.term,
          crn: cur.crn
        }
        if (acc.filter(el => el.courseId === c.courseId && el.term === c.term && el.crn === c.crn).length === 0) {
          acc.push(c);
        }
        return acc;
      }, []);

      this.initTable(this.classes);
    });

  }




  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
