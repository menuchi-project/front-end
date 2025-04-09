import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ItemsPageComponent } from './components/items-page/items-page.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconDirective, NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  NzInputDirective,
  NzInputGroupComponent,
  NzTextareaCountComponent,
} from 'ng-zorro-antd/input';
import { SharedModule } from '../shared/shared.module';
import { ItemsTableComponent } from './components/items-table/items-table.component';
import {
  CdkDrag,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { CategoriesPageComponent } from './components/categories-page/categories-page.component';
import { ManagementPageComponent } from './components/management-page/management-page.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { NzCardComponent, NzCardMetaComponent } from 'ng-zorro-antd/card';
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import {
  NzDropDownDirective,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { CdkScrollable } from '@angular/cdk/overlay';
import { BacklogPageComponent } from './components/backlog-page/backlog-page.component';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import {
  NzModalComponent,
  NzModalContentDirective,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { AddItemComponent } from './components/add-item/add-item.component';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';

@NgModule({
  declarations: [
    ItemsPageComponent,
    ItemsTableComponent,
    CategoriesPageComponent,
    ManagementPageComponent,
    BacklogPageComponent,
    CategoryComponent,
    AddItemComponent,
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
    NzDropDownDirective,
    NzDropdownMenuComponent,
    CdkDragHandle,
    CdkScrollable,
    NzEmptyComponent,
    NzModalComponent,
    NzModalContentDirective,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzColDirective,
    ReactiveFormsModule,
    NzFormControlComponent,
    NzCheckboxComponent,
    NzRowDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzTextareaCountComponent,
  ],
  providers: [NzModalService],
  exports: [ItemsPageComponent, ManagementPageComponent],
})
export class UserModule {}
