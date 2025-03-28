import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesPageComponent } from './user/components/categories-page/categories-page.component';
import { ManagementPageComponent } from './user/components/management-page/management-page.component';
import { AppComponent } from './app.component';
import { ItemsPageComponent } from './user/components/items-page/items-page.component';
import { BacklogPageComponent } from './user/components/backlog-page/backlog-page.component';

const routes: Routes = [
  { path: 'home', component: AppComponent, data: { breadcrumb: 'خانه' } },
  {
    path: 'manage',
    component: ManagementPageComponent,
    data: { breadcrumb: 'صفحه اصلی' },
    children: [
      {
        path: 'items',
        component: ItemsPageComponent,
        data: { breadcrumb: 'داشبورد مدیریت' },
      },
      {
        path: 'cats',
        component: BacklogPageComponent,
        data: { breadcrumb: 'بک لاگ' },
        children: [
          {
            path: '',
            component: CategoriesPageComponent,
            data: { breadcrumb: '' },
          },
          {
            path: 'items',
            component: ItemsPageComponent,
            data: { breadcrumb: 'آیتم غذایی' },
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
