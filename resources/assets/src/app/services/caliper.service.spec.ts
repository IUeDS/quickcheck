import { TestBed } from '@angular/core/testing';

import { CaliperService } from './caliper.service';

describe('CaliperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaliperService = TestBed.get(CaliperService);
    expect(service).toBeTruthy();
  });
});
