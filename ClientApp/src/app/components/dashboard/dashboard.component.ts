import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { BrowserModule } from '@angular/platform-browser';

import { NgxChartsModule } from '@swimlane/ngx-charts';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  single: any[];
  multi: any[];

  view: any[] = [500, 300];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', 'pink']
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

  constructor(private breakpointObserver: BreakpointObserver) {
    this.single = [
      [{
        "name": "Students ",
        "value": 3510
      }],
      [{
        "name": "Courses ",
        "value": 15
      }],
      [{
        "name": "Waitlist ",
        "value": 1512
      }],
      [{
        "name": "Accounts ",
        "value": 3
      }]
    ]
      ;
  }


}
