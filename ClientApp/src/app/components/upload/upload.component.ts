import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public progress: number = 0;
  public isUploading: boolean = false;
  public files: File[] = [];

  constructor(private uploadService: UploadService) { }

  ngOnInit() { }

  onFileDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      let file: File = files.item(i);

      this.files.push(file);
    }
  }

  upload() {    
    this.isUploading = true;

    this.uploadService.upload(this.files)
      .subscribe((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          console.log(event.body);
          this.isUploading = false;
        }
      }, error => {
        console.log(error);
        this.isUploading = false;
      });
  }
}
