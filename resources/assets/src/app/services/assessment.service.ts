import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private httpClient: HttpClient, private httpService: HttpService) { }

  async getQuestions(id) {
    const timeoutLength = this.httpService.getMediumTimeout();
    const path = this.httpService.getApiRoute() + '/assessment/' + id + '/questions';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async gradePassback(attemptId) {
    const timeoutLength = this.httpService.getLongTimeout();
    const path = this.httpService.getApiRoute() + '/grade/passback';

    return await this.httpClient.post(path, { attemptId })
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async initAttempt(assessmentId, preview, attemptId = null, nonce = null, studentId = null) {
    const timeoutLength = this.httpService.getMediumTimeout();
    const path = this.httpService.getApiRoute() + '/attempt/' + assessmentId;
    const params = { preview, attemptId, nonce, studentId };

    return await this.httpClient.post(path, params)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async submitQuestion(id, submission) {
    const timeoutLength = this.httpService.getMediumTimeout();
    const path = this.httpService.getApiRoute() + '/question/' + id + '/submit';

    return await this.httpClient.post(path, submission)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }
}