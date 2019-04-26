import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public progress: number;
  public message: string;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  upload(files) {
    if (files.length === 0) return;

    const formData = new FormData();

    for (let file of files) {
      formData.append(file.name, file);
    }
    
    const request = new HttpRequest('POST', 'https://localhost:44327/api/upload', formData, {
      reportProgress: true,
    });

    this.http.request(request)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      }, error => {
        this.message = error.toString();
      });
  }
}
