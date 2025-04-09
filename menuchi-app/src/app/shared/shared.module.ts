import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconDirective, NzIconModule } from 'ng-zorro-antd/icon';
import {
  NzMenuDirective,
  NzMenuItemComponent,
  NzSubMenuComponent,
} from 'ng-zorro-antd/menu';
import { NzSiderComponent } from 'ng-zorro-antd/layout';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { UploadBoxComponent } from './components/upload-box/upload-box.component';

@NgModule({
  declarations: [BreadcrumbComponent, TruncatePipe, UploadBoxComponent],
  imports: [
    CommonModule,
    NzIconDirective,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSiderComponent,
    NzSubMenuComponent,
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    RouterLink,
    NzButtonModule,
    NzIconModule,
    NzUploadModule,
  ],
  exports: [BreadcrumbComponent, TruncatePipe, UploadBoxComponent],
})
export class SharedModule {}
