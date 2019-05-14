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
import { AddWaitlistComponent } from '../modals/waitlist/add/add-waitlist.component';
import { Eligibility } from 'src/app/models/Eligibility';
import { first } from 'rxjs/operators';

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
  displayedColumns: string[] = ['studentId', 'studentName', 'viewStudent', 'delete'];
  dataSource: MatTableDataSource<Waitlist>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private waitlistService: WaitlistService,
    private courseService: CourseService,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
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

  openAddDialog() {
    this.newWaitlist = new Waitlist();
    this.newWaitlist.courseId = this.courseId;
    this.newWaitlist.crn = this.crn;
    this.newWaitlist.term = this.term;
    let dialogRef = this.dialog.open(AddWaitlistComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        waitlist: this.newWaitlist,
        waitlists: this.waitlists,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.checkWaitlist(result.waitlist.courseId, result.waitlist);

      }
      this.newWaitlist = new Waitlist();
    });
  }

  checkWaitlist(courseId: string, waitlist: Waitlist) {
    this.courseService.getEligibleByCourseId(courseId).subscribe((data: Eligibility[]) => {

      let studentId = waitlist.studentId;
      if (data.filter(d => d.studentId === studentId).length > 0) {
        this.addWaitlist(waitlist);
      }
      else {
        this.openSnackBar("Student is not qualified", "");
      }

    })
  }

  addWaitlist(waitlist: Waitlist) {

    this.waitlistService.addWaitlist(waitlist).pipe(first()).subscribe((response: Response) => {
      console.log(waitlist, response);
      this.refresh();
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top'
    });
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
    })
  }

  getStudentNameByStudentID(studentId: string) {
    return this.students.filter(s => s.studentId == studentId)[0].studentName;
  }


}
