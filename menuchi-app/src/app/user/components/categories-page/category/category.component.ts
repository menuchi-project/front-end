import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ModalService } from '../../../services/modal/modal.service';
import { Category, Item } from '../../../models/Item';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ItemService } from '../../../services/item/item.service';
import { finalize } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnChanges {
  loading: boolean = false;

  @Input() list!: Category;
  @Input() connectedLists: string[] = [];
  @Input() searchTerm: string = '';
  @Output() itemDropped = new EventEmitter<CdkDragDrop<any[]>>();
  @Output() itemDeleted = new EventEmitter<string>();

  constructor(
    private readonly modalService: ModalService,
    private readonly messageService: NzMessageService,
    private readonly itemService: ItemService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm'] || changes['list']) {
    }
  }

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
              const updatedList = response.categories.find(
                (cat) => cat.id === this.list.id,
              );
              if (updatedList) {
                this.list.items = updatedList.items;
              }
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

  highlightText(text: string): SafeHtml {
    if (!this.searchTerm || !text) {
      return this.sanitizer.bypassSecurityTrustHtml(text);
    }
    const escapedSearchTerm = this.searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    const highlightedText = text.replace(
      regex,
      '<span class="highlight">$&</span>',
    );
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
}
