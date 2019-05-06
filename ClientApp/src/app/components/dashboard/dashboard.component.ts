import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { BrowserModule } from '@angular/platform-browser';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { Waitlist } from 'src/app/models/waitlist';
import { User } from 'src/app/models/user';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  single: any[] = [];
  multi: any[];
  public studentCount: number = 0;
  public courseCount: number = 0;
  public waitlistCount: number = 0;
  public accountCount: number = 0;



  colorScheme = {
    domain: ['#f7ff26', '#AB28F7', '#2F72ED', '#28F78C']
  };
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1, item: [this.single[0]] },
          { title: 'Card 2', cols: 1, rows: 1, item: [this.single[1]] },
          { title: 'Card 3', cols: 1, rows: 1, item: [this.single[2]] },
          { title: 'Card 4', cols: 1, rows: 1, item: [this.single[3]] }
        ];
      }

      return [
        { title: 'Card 1', cols: 1, rows: 1, item: [this.single[0]] },
        { title: 'Card 2', cols: 1, rows: 1, item: [this.single[1]] },
        { title: 'Card 3', cols: 1, rows: 1, item: [this.single[2]] },
        { title: 'Card 4', cols: 1, rows: 1, item: [this.single[3]] }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private service: DashboardService) {
  }
  async ngOnInit() {


    await this.getStudents();
    await this.getCourses();
    await this.getWaitlists();
    await this.getAccounts();

    this.single = [
      [{
        "name": "Students ",
        "value": this.studentCount
      }],
      [{
        "name": "Courses ",
        "value": this.courseCount
      }],
      [{
        "name": "Waitlists ",
        "value": this.waitlistCount
      }],
      [{
        "name": "Accounts ",
        "value": this.accountCount
      }]
    ]
      ;






    /** 
     * This is to fix the responsive view for ng charts
     */

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    });



  }

  onSelect(event) {
    let name = event.name.trim();
    if (name === 'Students')
      this.router.navigate(['student'])
    else if (name === 'Courses')
      this.router.navigate(['course'])
    else if (name === 'Waitlists')
      this.router.navigate(['waitlist'])
    else if (name === 'Accounts') {
      this.router.navigate(['account'])
    }


  }

  async getStudents() {
    await this.service.getStudents().toPromise().then(data => {
      this.studentCount = data.length;
    })
  }
  async getCourses() {
    await this.service.getCourses().toPromise().then(data => {
      this.courseCount = data.length;
    })
  }
  async getWaitlists() {
    await this.service.getWaitlists().toPromise().then(data => {
      this.waitlistCount = data.length;
    })
  }
  async getAccounts() {
    await this.service.getAccounts().toPromise().then(data => {
      this.accountCount = data.length;
    })
  }



}




