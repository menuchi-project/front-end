import { TestBed } from '@angular/core/testing';

import { UploadImageService } from './upload-image.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('UploadImageService', () => {
  let service: UploadImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withFetch())],
    });
    service = TestBed.inject(UploadImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
