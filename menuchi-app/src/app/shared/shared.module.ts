import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzProgressComponent } from 'ng-zorro-antd/progress';
import { PersianNumberPipe } from './pipes/persian-number/persian-number.pipe';
import { HorizontalScrollerComponent } from './components/horizontal-scroller/horizontal-scroller.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    TruncatePipe,
    UploadBoxComponent,
    PersianNumberPipe,
    HorizontalScrollerComponent,
  ],
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
    NzModalComponent,
    NzModalModule,
    NzProgressComponent,
    NgOptimizedImage,
  ],
  exports: [
    BreadcrumbComponent,
    TruncatePipe,
    UploadBoxComponent,
    PersianNumberPipe,
    HorizontalScrollerComponent,
  ],
})
export class SharedModule {}
