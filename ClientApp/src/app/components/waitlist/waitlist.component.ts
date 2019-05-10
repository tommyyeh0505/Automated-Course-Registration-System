import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTooltipModule, MatDialog } from '@angular/material';
import { Grade } from 'src/app/models/grade';
import { GradeService } from 'src/app/services/grade.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Waitlist } from 'src/app/models/waitlist';
import { Class } from 'src/app/models/class';
import { WaitlistService } from 'src/app/services/waitlist.service';
import { AddWaitlistComponent } from '../modals/waitlist/add/add-waitlist.component';
import { first } from 'rxjs/operators';

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
  newWailist: Waitlist;
  waitlists: Waitlist[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private waitlistService: WaitlistService,
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
    this.newWailist = new Waitlist();

    let dialogRef = this.dialog.open(AddWaitlistComponent, {
      width: '65vw',
      minWidth: '300px',
      maxWidth: '600px',
      data: {
        waitlist: this.newWailist,
        waitlists: this.waitlists,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(result);
        this.addWaitlist(result.waitlist);
      }
      this.newWailist = new Waitlist();
    });
  }

  viewWaitlist(obj: Class) {
    this.router.navigate([`/waitlist/${obj.courseId}-${obj.crn}-${obj.term}`]);

  }

  addWaitlist(waitlist: Waitlist) {

    this.waitlistService.addWaitlist(waitlist).pipe(first()).subscribe((response: Response) => {
      console.log(waitlist, response);
      this.refresh();
    })
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
