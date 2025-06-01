import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyCalendarComponent } from './weekly-calendar.component';
import { PersianNumberPipe } from '../../../shared/pipes/persian-number/persian-number.pipe';

describe('WeeklyCalenderComponent', () => {
  let component: WeeklyCalendarComponent;
  let fixture: ComponentFixture<WeeklyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeeklyCalendarComponent, PersianNumberPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
