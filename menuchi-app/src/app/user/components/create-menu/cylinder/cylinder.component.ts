import { Component, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-cylinder',
  standalone: false,
  templateUrl: './cylinder.component.html',
  styleUrl: './cylinder.component.scss',
})
export class CylinderComponent {
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
