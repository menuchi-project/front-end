import { TestBed } from '@angular/core/testing';
import { RestaurantService } from './restaurant.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('RestaurantService', () => {
  let service: RestaurantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withFetch())],
    });
    service = TestBed.inject(RestaurantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});