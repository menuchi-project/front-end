import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';
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

@NgModule({
  declarations: [BreadcrumbComponent, TruncatePipe],
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
  ],
  exports: [BreadcrumbComponent, TruncatePipe],
})
export class SharedModule {}
