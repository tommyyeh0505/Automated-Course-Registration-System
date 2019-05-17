import { Directive, HostListener, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { UploadService } from '../services/upload.service'
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Directive({
  selector: '[appDropFile]'
})
export class DropFileDirective {
  @Output()
  public dragOverEvent: EventEmitter<any>;

  @Output()
  public dragLeaveEvent: EventEmitter<any>;

  @Output()
  public fileDropEvent: EventEmitter<FileList>;

  constructor(private element: ElementRef) {
    this.fileDropEvent = new EventEmitter();
    this.dragOverEvent = new EventEmitter();
    this.dragLeaveEvent = new EventEmitter();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverEvent.emit();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragLeaveEvent.emit();
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    this.fileDropEvent.emit(event.dataTransfer.files);
  }
}
