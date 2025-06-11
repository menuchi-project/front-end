import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ItemsPageComponent } from './components/items-page/items-page.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconDirective, NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {
  NzInputDirective,
  NzInputGroupComponent,
  NzInputModule,
  NzTextareaCountComponent,
} from 'ng-zorro-antd/input';
import { SharedModule } from '../shared/shared.module';
import { ItemsTableComponent } from './components/items-page/items-table/items-table.component';
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
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CategoryComponent } from './components/categories-page/category/category.component';
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
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { CylinderComponent } from './components/create-menu/cylinder/cylinder.component';
import { CategoryCollapseComponent } from './components/create-menu/category-collapse/category-collapse.component';
import {
  NzCollapseComponent,
  NzCollapsePanelComponent,
} from 'ng-zorro-antd/collapse';
import { SelectDaysComponent } from './components/select-days/select-days.component';
import { SelectItemsDrawerComponent } from './components/create-menu/select-items-drawer/select-items-drawer.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import {
  NzDrawerComponent,
  NzDrawerContentDirective,
  NzDrawerModule,
} from 'ng-zorro-antd/drawer';
import { SelectDaysModalComponent } from './components/create-menu/select-days-modal/select-days-modal.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzImageService } from 'ng-zorro-antd/image';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { DashboardContentComponent } from './components/dashboard-page/dashboard-content/dashboard-content.component';
import { MainModule } from '../main/main.module';
import { JoinNonEmptyPipe} from './components/dashboard-page/dashboard-content/dashboard-content.component';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { HighlightPipe } from '../shared/pipes/highlight/highlight.pipe';
import { CreatedMenusPageComponent } from './components/created-menus-page/created-menus-page.component';

@NgModule({
  declarations: [
    ItemsPageComponent,
    ItemsTableComponent,
    CategoriesPageComponent,
    BacklogPageComponent,
    CategoryComponent,
    AddItemComponent,
    CreateMenuComponent,
    CylinderComponent,
    CategoryCollapseComponent,
    SelectDaysComponent,
    SelectItemsDrawerComponent,
    SelectDaysModalComponent,
    DashboardPageComponent,
    SettingsPageComponent,
    DashboardContentComponent,
    JoinNonEmptyPipe,
    CreatedMenusPageComponent,
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
    NzCollapseComponent,
    NzCollapsePanelComponent,
    FormsModule,
    NzButtonModule,
    NzDividerModule,
    NzInputModule,
    NzDrawerComponent,
    NzDrawerContentDirective,
    FormsModule,
    NzButtonModule,
    NzDrawerModule,
    NzRadioModule,
    MainModule,
    NzToolTipModule,
    NzSpinComponent,
    HighlightPipe,
  ],
  providers: [NzModalService, NzImageService],
  exports: [ItemsPageComponent],
})
export class UserModule {}
