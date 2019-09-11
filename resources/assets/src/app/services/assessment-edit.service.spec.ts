import { TestBed } from '@angular/core/testing';

import { AssessmentEditService } from './assessment-edit.service';

describe('AssessmentEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssessmentEditService = TestBed.get(AssessmentEditService);
    expect(service).toBeTruthy();
  });
});
