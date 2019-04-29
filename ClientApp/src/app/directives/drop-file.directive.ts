import { Directive, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../services/upload.service'
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Directive({
  selector: '[appDropFile]'
})
export class DropFileDirective {

  @Output()
  public progressEvent: EventEmitter<any>;

  constructor(private element: ElementRef, private uploadService: UploadService) {
    this.progressEvent = new EventEmitter();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.style.backgroundColor = '#e2e2e2';
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.style.backgroundColor = '#ffffff';
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    let files = event.dataTransfer.files;

    this.uploadService.upload(files)
      .subscribe((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressEvent.emit(Math.round(100 * event.loaded / event.total));
          
        } else if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      }, error => {
        console.log(error);
      });

    this.element.nativeElement.style.backgroundColor = '#ffffff';
  }
}
