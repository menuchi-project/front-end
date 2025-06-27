import { TestBed } from '@angular/core/testing';

import { ErrorMappingService } from './error-mapping.service';

describe('ErrorMappingService', () => {
  let service: ErrorMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
