import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Menu, MenuCategory } from '../../../models/Menu';

@Component({
  selector: 'app-cylinder',
  standalone: false,
  templateUrl: './cylinder.component.html',
  styleUrl: './cylinder.component.scss',
})
export class CylinderComponent {
  @Input() panels: MenuCategory[] = [];
  @Input() weekDays!: string;
  @Output() itemDropped = new EventEmitter<CdkDragDrop<any[]>>();
  @Output() addItemWithCategory = new EventEmitter<string>();

  loading: boolean = false;
  itemChecked: boolean = true;

  drop2(event: CdkDragDrop<any[]>) {
    this.itemDropped.emit(event);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
