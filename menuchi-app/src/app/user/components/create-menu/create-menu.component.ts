import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category, CategoryWithItemsResponse } from '../../models/Item';
import { ItemService } from '../../services/item/item.service';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-menu',
  standalone: false,
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.scss',
})
export class CreateMenuComponent implements OnInit {
  lists: Category[] = [];
  selectedCategoryForModal: string | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly itemService: ItemService,
    private readonly titleService: TitleService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.itemService.categoriesData$.subscribe({
      next: (response: CategoryWithItemsResponse) => {
        this.lists = response.categories;
      },
      error: (error) => {
        console.log('error in categories page, line 36:', error);
      },
    });

    this.itemService.getCategoriesWithItems();
    this.titleService.onPageChanged$.next('ایجاد منوی جدید');
  }

  onListDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);

    this.cdr.detectChanges();
  }

  showModal(): void {
    this.modalService.openModal();
  }

  openModalForCategory(categoryId: string): void {
    this.selectedCategoryForModal = categoryId;
    this.modalService.openModal();
  }

  showAddCategoryModal() {}
}
