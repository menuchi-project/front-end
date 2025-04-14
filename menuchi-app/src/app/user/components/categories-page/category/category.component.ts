import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ModalService } from '../../../services/modal/modal.service';
import { Category } from '../../../models/Item';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  loading: boolean = false;

  @Input() list!: Category;
  @Input() connectedLists: string[] = [];
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
