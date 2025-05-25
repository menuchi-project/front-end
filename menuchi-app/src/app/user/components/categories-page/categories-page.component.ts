import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ItemService } from '../../services/item/item.service';
import {
  Category,
  CategoryWithItemsResponse,
  UpdateItemRequest,
} from '../../models/Item';
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
  searchTerm: string = '';
  filteredLists: Category[] = [];

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
        this.filterItems(); // Call filterItems initially
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
      this.itemService.reorderInCategory(
        this.lists[currIndex].items.map((i) => i.id),
      );
    } else {
      const movedItem = this.lists[prevIndex].items[event.previousIndex];
      const newCategoryId = this.lists[currIndex].id;

      transferArrayItem(
        this.lists[prevIndex].items,
        this.lists[currIndex].items,
        event.previousIndex,
        event.currentIndex,
      );

      const updateRequest: UpdateItemRequest = {
        categoryId: newCategoryId,
        subCategoryId: movedItem.subCategoryId,
        name: movedItem.name,
        ingredients: movedItem.ingredients,
        price: movedItem.price,
        picKey: null,
      };

      this.itemService.updateItem(movedItem.id, updateRequest).subscribe({
        next: () => {
          this.itemService.reorderInCategory(
            this.lists[currIndex].items.map((i) => i.id),
          );
        },
        error: (error) => {
          transferArrayItem(
            this.lists[currIndex].items,
            this.lists[prevIndex].items,
            event.currentIndex,
            event.previousIndex,
          );
        },
      });
    }

    this.cdr.detectChanges();
  }

  onListDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);

    this.cdr.detectChanges();
    this.itemService.reorderCategories(this.lists.map((c) => c.id));
  }

  showModal(): void {
    this.modalService.openModal(null);
  }

  filterItems(): void {
    if (!this.searchTerm) {
      this.filteredLists = JSON.parse(JSON.stringify(this.lists)); // Deep copy to avoid modifying original lists
    } else {
      this.filteredLists = this.lists.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            item.ingredients
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()),
        ),
      }));
    }
  }
}
