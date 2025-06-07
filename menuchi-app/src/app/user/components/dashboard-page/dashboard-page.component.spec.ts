import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPageComponent } from './dashboard-page.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { WeeklyCalendarComponent } from '../../../main/components/weekly-calendar/weekly-calendar.component';
import { provideRouter, RouterLink, RouterLinkActive } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import {
  HomeOutline,
  LogoutOutline,
  MenuOutline,
  ProductOutline,
  ProfileOutline,
  SettingOutline,
} from '@ant-design/icons-angular/icons';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardPageComponent,
        WeeklyCalendarComponent,
        BreadcrumbComponent,
      ],
      providers: [
        provideNoopAnimations(),
        provideAnimationsAsync(),
        provideHttpClient(withFetch()),
        provideRouter([
          { path: 'dashboard', component: DashboardPageComponent },
          { path: 'dashboard/menu', component: WeeklyCalendarComponent },
        ]),
      ],
      imports: [
        NzBreadCrumbModule,
        NzLayoutModule,
        NzIconModule,
        NzMenuModule,
        RouterLink,
        RouterLinkActive,
        RouterTestingModule,
        NzIconModule.forChild([
          HomeOutline,
          ProductOutline,
          SettingOutline,
          LogoutOutline,
          ProfileOutline,
          MenuOutline,
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
