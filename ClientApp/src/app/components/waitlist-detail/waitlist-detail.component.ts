import { Component, OnInit, ViewChild } from '@angular/core';
import { Waitlist } from 'src/app/models/waitlist';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { GradeService } from 'src/app/services/grade.service';
import { WaitlistService } from 'src/app/services/waitlist.service';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-waitlist-detail',
  templateUrl: './waitlist-detail.component.html',
  styleUrls: ['./waitlist-detail.component.css']
})
export class WaitlistDetailComponent implements OnInit {

  courseId: string;
  crn: string;
  term: string;
  // waitlist: Waitlist;
  students: Student[];
  waitlists: Waitlist[];
  course: Course;
  courseCreated: boolean;
  displayedColumns: string[] = ['studentId', 'studentName', 'viewStudent', 'edit', 'delete'];
  dataSource: MatTableDataSource<Waitlist>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private waitlistService: WaitlistService,
    private courseService: CourseService,
    private studentService: StudentService,
    public dialog: MatDialog,
    private gradeService: GradeService) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      let id = params.id.split('-');
      this.courseId = id[0];
      this.crn = id[1];
      this.term = id[2];

      // this.getStudents();
      this.getWaitlistsByKey(this.courseId, this.crn, this.term);

    })

  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  refresh() {
    this.getWaitlistsByKey(this.courseId, this.crn, this.term);
  }

  getWaitlistsByKey(courseId: string, crn: string, term: string) {
    this.waitlistService.getWaitlistsByKey(courseId, crn, term).subscribe((data: Waitlist[]) => {
      this.getCourseByCourseId(courseId);
      this.waitlists = data;
      this.initTable(data);


    }, err => {
      this.router.navigate(['/error']);
    })
  }


  getCourseByCourseId(courseId: string) {
    this.courseService.getCourse(courseId).subscribe((data: Course) => {
      this.courseCreated = true;
      this.course = data;
    }, error => {
      this.courseCreated = false;
    })
  }


  getStudentNameByStudentID(studentId: string) {
    return this.studentService.getStudent(studentId).subscribe((data: Student) => {
      return data.studentName;
    })
  }


}
