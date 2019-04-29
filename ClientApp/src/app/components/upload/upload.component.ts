import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public progress: number = 0;

  constructor(private http: HttpClientModule) {

  }

  ngOnInit() {}

  onProgress(event) {
    this.progress = event;
  }
}
