import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course';
import { GradeService } from 'src/app/services/grade.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Class } from 'src/app/models/class';
import { Grade } from 'src/app/models/grade';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  displayedColumns: string[] = ['courseId', 'crn', 'term', 'view'];

  course: Course = new Course();
  dataSource: MatTableDataSource<Class>;
  classes: Class[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private gradeService: GradeService) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id;
      this.getCourseById(id);

    });
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
        if (c.courseId === this.course.courseId && acc.filter(el => el.courseId === c.courseId && el.term === c.term && el.crn === c.crn).length === 0) {
          acc.push(c);
        }
        return acc;
      }, []);
      console.log(this.classes);

      this.initTable(this.classes);
    });
  }

  getCourseById(id: string) {
    this.courseService.getCourse(id).subscribe((data: Course) => {
      this.course = data;
      this.getClasses();
    }, err => {
      this.router.navigate(['/error']);
    }
    );
  }



  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
