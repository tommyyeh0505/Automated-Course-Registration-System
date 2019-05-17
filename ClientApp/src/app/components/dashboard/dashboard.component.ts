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
import { Class } from 'src/app/models/class';
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
  public classCount: number = 0;



  colorScheme = {
    domain: ['#F74385', '#AB28F7', '#028c0d', '#2F72ED']
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
    await this.getClasses();

    this.single = [
      [{
        "name": "Students",
        "value": this.studentCount
      }],
      [{
        "name": "Courses",
        "value": this.courseCount
      }],
      [{
        "name": "Grades",
        "value": this.classCount
      }],
      [{
        "name": "Waitlists",
        "value": this.waitlistCount
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
    else if (name === 'Grades') {
      this.router.navigate(['grade'])
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
  async getClasses() {
    await this.service.getGrades().toPromise().then(data => {
      let classes = data.reduce((acc, cur) => {
        let c = {
          courseId: cur.courseId,
          term: cur.term,
          crn: cur.crn
        }
        if (acc.filter(el => el.courseId === c.courseId && el.term === c.term && el.crn === c.crn).length === 0) {
          acc.push(c);

        }
        return acc;
      }, [])
      this.classCount = classes.length;


    })
  }



}




