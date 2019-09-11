import { TestBed } from '@angular/core/testing';

import { EditAssessmentConfigService } from './edit-assessment-config.service';

describe('EditAssessmentConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditAssessmentConfigService = TestBed.get(EditAssessmentConfigService);
    expect(service).toBeTruthy();
  });
});
