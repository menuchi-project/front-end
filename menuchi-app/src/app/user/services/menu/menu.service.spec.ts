import { TestBed } from '@angular/core/testing';

import { MenuService } from './menu.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withFetch())],
    });
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
