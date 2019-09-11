import { TestBed } from '@angular/core/testing';

import { CaliperForwarderService } from './caliper-forwarder.service';

describe('CaliperForwarderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaliperForwarderService = TestBed.get(CaliperForwarderService);
    expect(service).toBeTruthy();
  });
});
