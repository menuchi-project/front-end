import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { RestaurantLoginComponent } from './components/restaurant-login/restaurant-login.component';
import { RestaurantSignupComponent } from './components/restaurant-signup/restaurant-signup.component';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { RouterLink } from '@angular/router';
import { WeeklyCalenderComponent } from './components/dashboard/weekly-calender/weekly-calender.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RestaurantLoginComponent,
    RestaurantSignupComponent,
    DashboardComponent,
    WeeklyCalenderComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzInputGroupComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzAlertComponent,
    RouterLink,
    NgOptimizedImage,
    SharedModule,
  ],
  exports: [WeeklyCalenderComponent],
})
export class MainModule {}
