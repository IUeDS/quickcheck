import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  getApiRoute() {
    return '/api';
  }

  getFormHttpOptions() {
    return { headers: new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded' })};
  }

  getDefaultTimeout() {
    return 5000;
  }

  getMediumTimeout() {
    return 10000;
  }

  getLongTimeout() {
    return 20000;
  }

  getCrazyLongTimeout() {
    return 60000;
  }

  getTimeoutErrorMessage() {
    return 'Request timed out';
  }
}
