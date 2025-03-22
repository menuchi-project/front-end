import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableTableComponent } from './draggable-table/draggable-table.component';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [DraggableTableComponent],
  imports: [CommonModule, CdkDropList, CdkDrag, NzTableModule, NzIconDirective],
  exports: [DraggableTableComponent],
})
export class SharedModule {}
