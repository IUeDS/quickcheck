import { TestBed } from '@angular/core/testing';

import { CustomActivityService } from './custom-activity.service';

describe('CustomActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomActivityService = TestBed.get(CustomActivityService);
    expect(service).toBeTruthy();
  });
});
