import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTooltipModule, MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Waitlist } from 'src/app/models/waitlist';
import { Class } from 'src/app/models/class';
import { WaitlistService } from 'src/app/services/waitlist.service';
import { AddWaitlistComponent } from '../modals/waitlist/add/add-waitlist.component';
import { first } from 'rxjs/operators';
import { CourseService } from 'src/app/services/course.service';
import { Eligibility } from 'src/app/models/Eligibility';
import { DownloadService } from 'src/app/services/download.service';

export interface WaitlistDialogData {
  waitlist: Waitlist;
  waitlists: Waitlist[];
}


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'waitlist',
  styleUrls: ['waitlist.component.css'],
  templateUrl: 'waitlist.component.html',
})

export class WaitlistComponent implements OnInit {
  displayedColumns: string[] = ['courseId', 'crn', 'term', 'view'];
  dataSource: MatTableDataSource<Class>;
  classes: Class[] = [];
  newWaitlist: Waitlist;
  waitlists: Waitlist[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private waitlistService: WaitlistService,
    private snackbar: MatSnackBar,
    private courseService: CourseService,
    private downloadService: DownloadService,
    public dialog: MatDialog,
    private router: Router
  ) {
  }
  ngOnInit() {
    this.getWaitlists();
  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refresh() {
    this.waitlistService.getWaitlists().subscribe((data: Waitlist[]) => {
      this.waitlists = data;
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

  getWaitlists() {
    this.waitlistService.getWaitlists().subscribe((data: Waitlist[]) => {
      this.waitlists = data;
     
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

  openAddDialog() {
    this.newWaitlist = new Waitlist();

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

  viewWaitlist(obj: Class) {
    this.router.navigate([`/waitlist/${obj.courseId}-${obj.crn}-${obj.term}`]);

  }

  addWaitlist(waitlist: Waitlist) {
    this.waitlistService.addWaitlist(waitlist).pipe(first()).subscribe((response: Response) => {
     
      this.refresh();
    })
  }

  checkWaitlist(courseId: string, waitlist: Waitlist) {
    this.courseService.getEligibleByCourseId(courseId).subscribe((data: Eligibility[]) => {

      let studentId = waitlist.studentId;
      if (data.filter(d => d.studentId === studentId).length > 0) {
        this.addWaitlist(waitlist);
        this.openSnackbar(`Student successfully ddded to the waitlist`, 'success-snackbar');
      }
      else {
        this.openSnackbar(`Student is not qualified`, 'error-snackbar');
      }

    })
  }

  export() {
    
    this.downloadService.downloadWaitlist();
  }
  openSnackbar(message: string, style: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000, verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: style
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
