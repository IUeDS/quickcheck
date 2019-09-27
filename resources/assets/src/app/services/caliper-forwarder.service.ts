import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CaliperForwarderService {

  constructor(private httpClient: HttpClient, private httpService: HttpService) { }

  async forwardEvent(sensorHost, eventData) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = sensorHost + '/api/events';

    return await this.httpClient.post(path, eventData)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }
}

