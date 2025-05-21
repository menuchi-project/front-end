import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPreviewComponent } from './menu-preview.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { WeeklyCalendarComponent } from '../weekly-calendar/weekly-calendar.component';
import { HorizontalScrollerComponent } from '../../../shared/components/horizontal-scroller/horizontal-scroller.component';
import { PersianNumberPipe } from '../../../shared/pipes/persian-number/persian-number.pipe';

describe('MenuPreviewComponent', () => {
  let component: MenuPreviewComponent;
  let fixture: ComponentFixture<MenuPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MenuPreviewComponent,
        WeeklyCalendarComponent,
        HorizontalScrollerComponent,
        PersianNumberPipe,
      ],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
