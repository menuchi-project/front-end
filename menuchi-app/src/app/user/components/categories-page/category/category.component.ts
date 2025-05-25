import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ModalService } from '../../../services/modal/modal.service';
import { Category, Item } from '../../../models/Item';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ItemService } from '../../../services/item/item.service';
import { finalize } from 'rxjs/operators';

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
  @Output() itemDeleted = new EventEmitter<string>();

  constructor(
    private readonly modalService: ModalService,
    private readonly messageService: NzMessageService,
    private readonly itemService: ItemService,
  ) {}

  drop2(event: CdkDragDrop<any[]>) {
    this.itemDropped.emit(event);
  }

  showAddItemModal(catNameId: string): void {
    this.modalService.openModal(this.list.categoryNameId, null);
  }

  editItem(item: Item): void {
    this.modalService.openModal(item.categoryId, item);
  }

  confirmDelete(id: string): void {
    this.loading = true;
    this.itemService
      .deleteItems([id])
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.messageService.info(' آیتم با موفقیت حذف شد.');
          this.itemService.getCategoriesWithItems().subscribe({
            next: (response) => {
              this.list.items =
                response.categories.find((cat) => cat.id === this.list.id)
                  ?.items || [];
            },
            error: (error) => {
              console.error('Error refreshing categories after delete:', error);
            },
          });
        },
        error: (error: any) => {
          this.messageService.error(' مشکلی در حذف آیتم به وجود آمد!');
        },
      });
  }
}
