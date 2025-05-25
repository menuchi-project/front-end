import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-categories-page',
  standalone: false,
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  lists: Category[] = [];
  allConnectedLists: string[] = [];
  _searchTerm: string = '';
  filteredLists: Category[] = [];
  isLoading: boolean = false;

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly itemService: ItemService,
    private readonly titleService: TitleService,
    private readonly modalService: ModalService,
  ) {}

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.searchSubject.next(value);
  }

  ngOnInit(): void {
    this.isLoading = true;
    const categoriesSubscription = this.itemService
      .getCategoriesWithItems()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: CategoryWithItemsResponse) => {
          this.lists = response.categories;
          this.allConnectedLists = this.lists.map((l) => l.id);
          this.filterItems();
        },
        error: (error: any) => {
          console.log('error in categories page:', error);
        },
      });
    this.subscriptions.push(categoriesSubscription);

    const searchSubscription = this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.filterItems();
        this.cdr.detectChanges();
      });
    this.subscriptions.push(searchSubscription);

    this.titleService.onPageChanged$.next('بک‌لاگ');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
      this.itemService
        .reorderInCategory(this.lists[currIndex].items.map((i) => i.id))
        .subscribe({
          next: () => console.log('Reordered in category successfully'),
          error: (error) =>
            console.error('Error reordering in category:', error),
        });
    } else {
      this.isLoading = true;
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

      this.itemService
        .updateItem(movedItem.id, updateRequest)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            this.itemService
              .reorderInCategory(this.lists[currIndex].items.map((i) => i.id))
              .subscribe({
                next: () =>
                  console.log('Reordered in new category successfully'),
                error: (error) =>
                  console.error('Error reordering in new category:', error),
              });
          },
          error: (error: any) => {
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
    this.isLoading = true;
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);

    this.cdr.detectChanges();
    this.itemService
      .reorderCategories(this.lists.map((c) => c.id))
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          console.log('Categories reordered successfully:', response);
        },
        error: (error: any) => {
          console.error('Error reordering categories:', error);
        },
      });
  }

  showModal(): void {
    this.modalService.openModal(null);
  }

  filterItems(): void {
    if (!this._searchTerm) {
      this.filteredLists = JSON.parse(JSON.stringify(this.lists));
    } else {
      this.filteredLists = this.lists.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(this._searchTerm.toLowerCase()) ||
            item.ingredients
              .toLowerCase()
              .includes(this._searchTerm.toLowerCase()),
        ),
      }));
    }
  }
}
