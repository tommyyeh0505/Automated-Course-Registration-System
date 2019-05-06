import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  upload(files) {
    if (files.length === 0) return;

    const formData = new FormData();

    for (let file of files) {
      formData.append(file.name, file);
    }

    const request = new HttpRequest('POST', environment.apiEndpoint + 'upload', formData, {
      reportProgress: true,
    });

    return this.http.request(request);
  }
}
