import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { OtpEmailEntryComponent } from './otp-email-entry-page.component';
import { AuthService } from '../../../main/services/auth/auth.service';

describe('OtpEmailEntryComponent', () => {
  let component: OtpEmailEntryComponent;
  let fixture: ComponentFixture<OtpEmailEntryComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['sendOtp']);

    await TestBed.configureTestingModule({
      imports: [OtpEmailEntryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpEmailEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
