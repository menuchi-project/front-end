import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPreviewComponent } from './menu-preview.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { WeeklyCalendarComponent } from '../../../shared/components/weekly-calendar/weekly-calendar.component';
import { HorizontalScrollerComponent } from '../../../shared/components/horizontal-scroller/horizontal-scroller.component';
import { PersianNumberPipe } from '../../../shared/pipes/persian-number/persian-number.pipe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('MenuPreviewComponent', () => {
  let component: MenuPreviewComponent;
  let fixture: ComponentFixture<MenuPreviewComponent>;

  const mockActivatedRoute = {
    paramMap: of({ get: (key: string) => 'testMenuId' }),
    snapshot: {
      paramMap: {
        get: (key: string) => 'testMenuId',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MenuPreviewComponent,
        WeeklyCalendarComponent,
        HorizontalScrollerComponent,
        PersianNumberPipe,
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
