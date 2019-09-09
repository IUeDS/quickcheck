import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SetService {

  constructor(private httpClient: HttpClient, private httpService: HttpService) {}

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
}
