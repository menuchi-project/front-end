import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ItemService } from '../../services/item/item.service';
import { Category, CategoryWithItemsResponse } from '../../models/Item';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-categories-page',
  standalone: false,
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
})
export class CategoriesPageComponent implements OnInit {
  lists: Category[] = [];
  allConnectedLists: string[] = [];
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
        this.allConnectedLists = this.lists.map((l) => l.id);
      },
      error: (error) => {
        console.log('error in categories page, line 36:', error);
      },
    });

    this.itemService.getCategoriesWithItems();
    this.titleService.onPageChanged$.next('بک‌لاگ');
  }

  onItemDropped(event: CdkDragDrop<any[]>) {
    const prevIndex = this.lists.findIndex(
      (list) => list.items === event.previousContainer.data,
    );
    const currIndex = this.lists.findIndex(
      (list) => list.items === event.container.data,
    );

    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.lists[prevIndex].items,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        this.lists[prevIndex].items,
        this.lists[currIndex].items,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.cdr.detectChanges();
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
}
