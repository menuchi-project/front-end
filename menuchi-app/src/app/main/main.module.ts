import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { RestaurantLoginComponent } from './components/restaurant-login/restaurant-login.component';
import { RestaurantSignupComponent } from './components/restaurant-signup/restaurant-signup.component';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';

@NgModule({
  declarations: [RestaurantLoginComponent, RestaurantSignupComponent],
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
  ],
})
export class MainModule {}
