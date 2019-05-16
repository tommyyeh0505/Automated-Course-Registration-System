import { Component, OnInit, ViewChild } from '@angular/core';
import { Waitlist } from 'src/app/models/waitlist';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { GradeService } from 'src/app/services/grade.service';
import { WaitlistService } from 'src/app/services/waitlist.service';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { Eligible } from 'src/app/models/eligible';
import { DetailWaitlistComponent } from '../modals/waitlist/detail/detail-waitlist.component';
import { DownloadService } from 'src/app/services/download.service';

export interface WaitlistDetail {
  detail: Eligible;
}
@Component({
  selector: 'app-waitlist-detail',
  templateUrl: './waitlist-detail.component.html',
  styleUrls: ['./waitlist-detail.component.css']
})
export class WaitlistDetailComponent implements OnInit {

  courseId: string;
  crn: string;
  term: string;
  newWaitlist: Waitlist;
  students: Student[];
  waitlists: Waitlist[];
  course: Course;
  courseCreated: boolean;
  eligible: Eligible[];
  ineligible: Eligible[];
  displayedColumns: string[] = ['waitlistId', 'studentId', 'studentName', 'fail', 'viewStudent', 'delete'];

  dataSource: MatTableDataSource<Waitlist>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private waitlistService: WaitlistService,
    private courseService: CourseService,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private downloadService: DownloadService,
    public dialog: MatDialog,
    private gradeService: GradeService) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      let id = params.id.split('-');
      this.courseId = id[0];
      this.crn = id[1];
      this.term = id[2];

      this.getStudents();
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

  getEligibleByCourseID() {
    this.courseService.getEligibleByCourseId(this.courseId).subscribe((data: Eligible[]) => {
      this.eligible = data;
    }, err => {
    })
  }

  getIneligibleByCourseID() {
    this.courseService.getIneligibleByCourseId(this.courseId).subscribe((data: Eligible[]) => {
      this.ineligible = data;
    }, err => {
    })
  }

  deleteWaitlist(waitlist: Waitlist) {
    this.waitlistService.deleteWaitlist(waitlist);

    let itemIndex = this.dataSource.data.findIndex(obj => obj.waitlistId === waitlist.waitlistId);
    this.dataSource.data.splice(itemIndex, 1);
    this.waitlists = this.dataSource.data;
    if (this.waitlists.length === 0) {
      this.router.navigate(['/waitlist']);
    }
    this.initTable(this.dataSource.data);

  }
  getCourseByCourseId(courseId: string) {
    this.courseService.getCourse(courseId).subscribe((data: Course) => {
      this.courseCreated = true;
      this.course = data;
    }, error => {
      this.courseCreated = false;
    })
  }

  getStudents() {
    this.studentService.getStudents().subscribe((data: Student[]) => {
      this.students = data;
      this.getEligibleByCourseID();
      this.getIneligibleByCourseID();
    })
  }

  openDetailDialog(student: Student) {


    let dialogRef = this.dialog.open(DetailWaitlistComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        detail: this.ineligible.filter(e => e.studentId === student.studentId)[0],

      }
    });


  }


  getStudentNameByStudentID(studentId: string) {
    if (this.students) {
      return this.students.filter(s => s.studentId == studentId)[0].studentName;

    }
    return '';
  }

  qualify(student: Student) {
    if (this.eligible) {

      return this.eligible.filter(e => e.studentId === student.studentId).length > 0;
    }
    return false;
  }

  getFailedCourse(student: Student) {
    if (this.ineligible) {
      if (this.qualify(student)) {
        return false;
      }
      return this.ineligible.filter(e => e.studentId === student.studentId).length > 0;

    }
    return false;
  }



}
