import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private httpClient: HttpClient, private httpService: HttpService) {}

  async deleteCollection(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collection/' + id;

    return await this.httpClient.delete(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getMemberships() {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/memberships';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getMembershipsWithAssessments() {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/memberships/assessments';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async quickAdd(assessment) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/quickadd';
    const options = this.httpService.getFormHttpOptions();

    return await this.httpClient.post(path, assessment)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async updateCollection(id, data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collection/' + id;
    const options = this.httpService.getFormHttpOptions();

    return await this.httpClient.put(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }
}
