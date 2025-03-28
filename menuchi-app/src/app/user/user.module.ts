import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ItemsPageComponent } from './items-page/items-page.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconDirective, NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import {
  NzButtonComponent,
  NzButtonGroupComponent,
} from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { SharedModule } from '../shared/shared.module';
import { ItemsTableComponent } from './items-page/items-table/items-table.component';
import {
  CdkDrag,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { ManagementPageComponent } from './management-page/management-page.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BacklogPageComponent } from './backlog-page/backlog-page.component';
import { CategoryComponent } from './categories-page/category/category.component';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { NzCardComponent, NzCardMetaComponent } from 'ng-zorro-antd/card';
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import {
  NzDropDownDirective,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { CdkScrollable } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    ItemsPageComponent,
    ItemsTableComponent,
    CategoriesPageComponent,
    ManagementPageComponent,
    BacklogPageComponent,
    CategoryComponent,
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
    NzSwitchComponent,
    NzCardMetaComponent,
    NzCardComponent,
    NzSkeletonComponent,
    NzAvatarComponent,
    CdkDragPreview,
    NzButtonGroupComponent,
    NzDropDownDirective,
    NzDropdownMenuComponent,
    CdkDragHandle,
    CdkScrollable,
  ],
  exports: [ItemsPageComponent, ManagementPageComponent],
})
export class UserModule {}
