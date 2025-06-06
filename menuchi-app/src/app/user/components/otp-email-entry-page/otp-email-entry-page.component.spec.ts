import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpEmailEntryPageComponent } from './otp-email-entry-page.component';

describe('OtpEmailEntryPageComponent', () => {
  let component: OtpEmailEntryPageComponent;
  let fixture: ComponentFixture<OtpEmailEntryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtpEmailEntryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpEmailEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
