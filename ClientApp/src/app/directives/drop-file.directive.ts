import { Directive, HostListener, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { UploadService } from '../services/upload.service'
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Directive({
  selector: '[appDropFile]'
})
export class DropFileDirective {

  @Output()
  public progressEvent: EventEmitter<any>;

  @Input()
  public defaultColor: string;

  @Input()
  public hoverColor: string;

  constructor(private element: ElementRef, private uploadService: UploadService) {
    this.progressEvent = new EventEmitter();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setBackgroundColor(this.hoverColor);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setBackgroundColor(this.defaultColor);
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

    this.setBackgroundColor(this.defaultColor);
  }

  private setBackgroundColor(color: string) {
    this.element.nativeElement.style.backgroundColor = color;
  }
}
