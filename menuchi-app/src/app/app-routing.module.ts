import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesPageComponent } from './user/categories-page/categories-page.component';
import { ManagementPageComponent } from './user/management-page/management-page.component';
import { AppComponent } from './app.component';
import { ItemsPageComponent } from './user/items-page/items-page.component';

const routes: Routes = [
  { path: 'home', component: AppComponent, data: { breadcrumb: 'خانه' } },
  {
    path: 'manage',
    component: ManagementPageComponent,
    data: { breadcrumb: 'پنل مدیریت' },
    children: [
      {
        path: '',
        component: ItemsPageComponent,
        data: { breadcrumb: 'داشبورد مدیریت' },
      },
      {
        path: 'cats',
        component: CategoriesPageComponent,
        data: { breadcrumb: 'بک لاگ' },
      },
    ],
  },
  // {
  //   path: 'manage/cats',
  //   component: CategoriesPageComponent,
  //   data: { breadcrumb: 'بک لاگ' },
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
