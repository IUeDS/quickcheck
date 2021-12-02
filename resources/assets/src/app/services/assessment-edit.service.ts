import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentEditService {

  constructor(private httpClient: HttpClient, private httpService: HttpService) { }

  async deleteAssessment(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/assessment/' + id;

    return await this.httpClient.delete(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getAssessment(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/assessment/' + id;

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async saveAssessment(data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/assessment';

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async updateAssessment(id, data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/assessment/' + id;

    return await this.httpClient.put(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async uploadImage(file) {
    const timeoutLength = this.httpService.getMediumTimeout();
    const path = this.httpService.getApiRoute() + '/assessment/imageupload';

    const data = new FormData();
    data.append('file', file, file.name);

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }
}
