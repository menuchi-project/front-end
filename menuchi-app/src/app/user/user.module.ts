import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ItemsPageComponent } from './items-page/items-page.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconDirective, NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { SharedModule } from '../shared/shared.module';
import { ItemsTableComponent } from './items-page/items-table/items-table.component';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { ManagementPageComponent } from './management-page/management-page.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BacklogPageComponent } from './backlog-page/backlog-page.component';

@NgModule({
  declarations: [
    ItemsPageComponent,
    ItemsTableComponent,
    CategoriesPageComponent,
    ManagementPageComponent,
    BacklogPageComponent,
  ],
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzButtonComponent,
    NzInputGroupComponent,
    NzInputDirective,
    SharedModule,
    NgOptimizedImage,
    CdkDropList,
    CdkDrag,
    NzTableModule,
    NzIconDirective,
    FormsModule,
    NzInputDirective,
    NzPopconfirmDirective,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  exports: [ItemsPageComponent, ManagementPageComponent],
})
export class UserModule {}
