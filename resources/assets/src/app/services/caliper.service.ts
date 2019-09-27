import { Injectable } from '@angular/core';
import { CaliperForwarderService } from './caliper-forwarder.service';

@Injectable({
  providedIn: 'root'
})
export class CaliperService {

  enabled = false;
  forwarder = null;
  sensorHost = false;

  constructor(private caliperForwarder: CaliperForwarderService) { }

  init(caliperData) {
    this.enabled = caliperData.isEnabled;
    this.sensorHost = caliperData.sensorHost;
  }

  isEnabled()  {
    return this.enabled;
  }

  async forwardEvent(caliperData) {
    if (!caliperData.data) {
      return false;
    }

    if (!this.sensorHost) {
      return false;
    }

    await this.caliperForwarder.forwardEvent(this.sensorHost, caliperData);
  }
}
