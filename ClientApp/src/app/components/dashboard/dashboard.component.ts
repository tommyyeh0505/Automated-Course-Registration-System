import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { BrowserModule } from '@angular/platform-browser';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  single: any[];
  multi: any[];

  view: any[] = [500, 250];

  colorScheme = {
    domain: ['#F74385', '#AB28F7', '#2F72ED', '#28F78C']
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

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
    this.single = [
      [{
        "name": "Students ",
        "value": 3510,
      }],
      [{
        "name": "Courses ",
        "value": 259
      }],
      [{
        "name": "Waitlists ",
        "value": 1512
      }],
      [{
        "name": "Accounts ",
        "value": 15
      }]
    ]
      ;

  }
  ngOnInit(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }); // BUGFIX:
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
}




