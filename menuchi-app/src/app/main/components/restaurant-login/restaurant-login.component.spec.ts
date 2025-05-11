import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantLoginComponent } from './restaurant-login.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';

describe('RestaurantLoginComponent', () => {
  let component: RestaurantLoginComponent;
  let fixture: ComponentFixture<RestaurantLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantLoginComponent],
      providers: [provideHttpClient(withFetch())],
      imports: [NzFormModule, ReactiveFormsModule, NzButtonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
