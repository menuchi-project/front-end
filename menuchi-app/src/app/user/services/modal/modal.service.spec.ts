import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withFetch())],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
