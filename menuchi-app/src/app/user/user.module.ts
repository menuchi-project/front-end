import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsPageComponent } from './items-page/items-page.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [ItemsPageComponent],
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzButtonComponent,
    NzInputGroupComponent,
    NzInputDirective,
  ],
  exports: [ItemsPageComponent],
})
export class UserModule {}
