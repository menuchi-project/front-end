import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesPageComponent } from './user/components/categories-page/categories-page.component';
import { AppComponent } from './app.component';
import { ItemsPageComponent } from './user/components/items-page/items-page.component';
import { BacklogPageComponent } from './user/components/backlog-page/backlog-page.component';
import { CreateMenuComponent } from './user/components/create-menu/create-menu.component';
import { RestaurantLoginComponent } from './main/components/restaurant-login/restaurant-login.component';
import { RestaurantSignupComponent } from './main/components/restaurant-signup/restaurant-signup.component';
import { authGuard } from './main/guards/auth.guard';
import { DashboardPageComponent } from './user/components/dashboard-page/dashboard-page.component';
import { SettingsPageComponent } from './user/components/settings-page/settings-page.component';
import { MenuPreviewComponent } from './main/components/menu-preview/menu-preview.component';
import { OtpEmailEntryComponent } from './user/components/otp-email-entry-page/otp-email-entry-page.component'; 
import { OtpVerificationComponent } from './user/components/otp-email-verification-page/otp-email-verification-page.component'; 

const routes: Routes = [
  { path: 'login', component: RestaurantLoginComponent, title: 'منوچی | ورود' },
  {
    path: 'signup',
    component: RestaurantSignupComponent,
    title: 'منوچی | ثبت نام',
  },
  { path: 'home', component: AppComponent, data: { breadcrumb: 'خانه' } },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    data: { breadcrumb: 'داشبورد' },
    title: 'منوچی | مدیریت',
    canActivate: [authGuard],
    children: [
      {
        path: 'preview/:menuId',
        component: MenuPreviewComponent,
        data: { breadcrumb: 'پیش‌نمایش منو' },
        title: 'پیش‌نمایش منو',
      },
      {
        path: 'items',
        component: ItemsPageComponent,
        data: { breadcrumb: 'داشبورد' },
        title: 'منوچی | داشبورد',
      },
      {
        path: 'menu',
        component: CreateMenuComponent,
        data: { breadcrumb: 'ایجاد منوی جدید' },
        title: 'منوچی | ایجاد منوی جدید',
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
        data: { breadcrumb: 'تنظیمات' },
        title: 'منوچی | تنظیمات',
      },
      {
        path: 'cats',
        component: BacklogPageComponent,
        data: { breadcrumb: 'بک‌لاگ' },
        title: 'منوچی | بک‌لاگ',
        children: [
          {
            path: '',
            component: CategoriesPageComponent,
            data: { breadcrumb: '' },
            title: 'منوچی | بک‌لاگ',
          },
          {
            path: 'items',
            component: ItemsPageComponent,
            data: { breadcrumb: 'آیتم‌های غذایی' },
            title: 'منوچی | آیتم‌های غذایی',
          },
        ],
      },
    ],
  },
  { path: 'otp-email-entry', component: OtpEmailEntryComponent, title: 'منوچی | ورود با OTP' },
  { path: 'otp-verification', component: OtpVerificationComponent, title: 'منوچی | تأیید OTP' },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
