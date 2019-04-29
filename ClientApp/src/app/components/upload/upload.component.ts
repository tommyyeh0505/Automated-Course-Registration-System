import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadService } from '../../services/upload.service'

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public progress: number;

  constructor(private http: HttpClient, private uploadService: UploadService) {
  }

  ngOnInit() {

  }

  upload(files) {
    this.uploadService.upload(files)
      .subscribe((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      }, error => {
        console.log(error);
      });
  }
}
