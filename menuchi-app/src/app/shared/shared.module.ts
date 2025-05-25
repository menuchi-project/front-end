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
import { PersianPricePipe } from './pipes/persian-price/persian-price.pipe';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { CdkDrag, CdkDragPreview } from '@angular/cdk/drag-drop';
import { NzCardComponent, NzCardMetaComponent } from 'ng-zorro-antd/card';
import {
  NzDropDownDirective,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    TruncatePipe,
    UploadBoxComponent,
    PersianNumberPipe,
    HorizontalScrollerComponent,
    PersianPricePipe,
    PersianNumberPipe,
    ItemCardComponent,
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
    CdkDrag,
    NzCardComponent,
    NzCardMetaComponent,
    NzDropDownDirective,
    NzDropdownMenuComponent,
    NzPopconfirmDirective,
    CdkDragPreview,
  ],
  exports: [
    BreadcrumbComponent,
    TruncatePipe,
    UploadBoxComponent,
    PersianNumberPipe,
    HorizontalScrollerComponent,
    PersianPricePipe,
    PersianNumberPipe,
    ItemCardComponent,
  ],
})
export class SharedModule {}
