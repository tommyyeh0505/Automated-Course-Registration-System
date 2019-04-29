import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpEvent, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadService } from '../../services/upload.service'
import { DropFileDirective } from 'src/app/directives/drop-file.directive';

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
    // console.log(event);
  }
}
