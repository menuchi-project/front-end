import { Component, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-category-collapse',
  standalone: false,
  templateUrl: './category-collapse.component.html',
  styleUrl: './category-collapse.component.scss',
})
export class CategoryCollapseComponent {
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

  constructor(private readonly modalService: ModalService) {}

  drop2(event: CdkDragDrop<any[]>) {
    this.itemDropped.emit(event);
  }

  showAddItemModal(): void {
    this.addItemWithCategory.emit(this.list.categoryNameId);
  }
}
