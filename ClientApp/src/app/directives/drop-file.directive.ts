import { Directive, HostListener, HostBinding } from '@angular/core';
import { UploadService } from '../services/upload.service'

@Directive({
  selector: '[appDropFile]'
})
export class DropFileDirective {

  constructor(private uploadService: UploadService) { }

  @HostBinding('style.background')
  private background = '#ffffff';

  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#00ff00';
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#ffffff';
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {
    let files = event.dataTransfer.files;

    this.uploadService.upload(files);

    this.background = '#ffffff';
  }
}
