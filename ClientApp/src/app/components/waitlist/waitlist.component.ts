import { Component, OnInit } from '@angular/core';
import { WaitlistService } from 'src/app/services/waitlist.service';

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css']
})
export class WaitlistComponent implements OnInit {

  constructor(private waitlistService: WaitlistService) { }

  ngOnInit() {
  }

}
