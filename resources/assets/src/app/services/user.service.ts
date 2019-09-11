import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private httpService: HttpService) { }

  async addAdmin(data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/user/addAdmin';

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getUser() {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/user';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getUserAndPermissions(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/user/collection/' + id;

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async joinPublicCollection(id, data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/publicmembership/collection/' + id;

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async optOutPublicCollection(id, data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/publicmembership/collection/' + id;

    return await this.httpClient.delete(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async validateUser(data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/user/validate';

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }
}
