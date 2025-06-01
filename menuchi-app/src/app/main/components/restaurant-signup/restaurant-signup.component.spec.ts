import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantSignupComponent } from './restaurant-signup.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';

describe('RestaurantSignupComponent', () => {
  let component: RestaurantSignupComponent;
  let fixture: ComponentFixture<RestaurantSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantSignupComponent],
      providers: [provideHttpClient(withFetch())],
      imports: [
        NzFormModule,
        NzInputModule,
        ReactiveFormsModule,
        NzCheckboxModule,
        NzButtonModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
