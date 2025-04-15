import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesPageComponent } from './user/components/categories-page/categories-page.component';
import { ManagementPageComponent } from './user/components/management-page/management-page.component';
import { AppComponent } from './app.component';
import { ItemsPageComponent } from './user/components/items-page/items-page.component';
import { BacklogPageComponent } from './user/components/backlog-page/backlog-page.component';
import { CreateMenuComponent } from './user/components/create-menu/create-menu.component';

const routes: Routes = [
  { path: 'home', component: AppComponent, data: { breadcrumb: 'خانه' } },
  {
    path: 'manage',
    component: ManagementPageComponent,
    data: { breadcrumb: 'صفحه اصلی' },
    title: 'منوچی | مدیریت',
    children: [
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
