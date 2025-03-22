import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsPageComponent } from './items-page/items-page.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule,
  ],
  exports: [ItemsPageComponent],
})
export class UserModule {}
