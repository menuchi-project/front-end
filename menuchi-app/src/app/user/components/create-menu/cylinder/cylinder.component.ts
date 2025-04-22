import { Component, EventEmitter, Output } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-cylinder',
  standalone: false,
  templateUrl: './cylinder.component.html',
  styleUrl: './cylinder.component.scss',
})
export class CylinderComponent {
  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      disabled: false,
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 2',
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 3',
    },
  ];

  loading: boolean = false;

  // @Input() list!: Category;
  list = {
    categoryName: 'تیثخحتنبخحثن',
    categoryNameId: '111',
    id: '111111',
    items: [
      {
        price: 12,
        ingredients: 'rrrropkfor kpfrk',
        picUrl: 'kk',
        name: 'jiroji',
      },
      {
        price: 12,
        ingredients: 'rrrropkfor kpfrk',
        picUrl: 'kk',
        name: 'jiroji',
      },
    ],
  };
  @Output() itemDropped = new EventEmitter<CdkDragDrop<any[]>>();
  @Output() addItemWithCategory = new EventEmitter<string>();
  itemChecked: boolean = true;

  constructor(private readonly modalService: ModalService) {}

  drop2(event: CdkDragDrop<any[]>) {
    this.itemDropped.emit(event);
  }

  showAddItemModal(): void {
    this.addItemWithCategory.emit(this.list.categoryNameId);
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
