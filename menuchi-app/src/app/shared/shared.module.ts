import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from 'ng-zorro-antd/menu';
import {NzSiderComponent} from 'ng-zorro-antd/layout';

@NgModule({
  declarations: [],
  imports: [CommonModule, NzIconDirective, NzMenuDirective, NzMenuItemComponent, NzSiderComponent, NzSubMenuComponent],
  exports: [],
})
export class SharedModule {
}
