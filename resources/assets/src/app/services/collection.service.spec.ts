import { TestBed } from '@angular/core/testing';

import { CollectionService } from './collection.service';

describe('SetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollectionService = TestBed.get(CollectionService);
    expect(service).toBeTruthy();
  });
});
