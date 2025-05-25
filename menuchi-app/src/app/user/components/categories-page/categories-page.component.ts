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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    const categoriesSubscription = this.itemService.categoriesData$.subscribe({
      next: (response: CategoryWithItemsResponse) => {
        this.lists = response.categories;
        this.allConnectedLists = this.lists.map((l) => l.id);
        this.filterItems();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log('error in categories page:', error);
        this.isLoading = false;
      },
    });
    this.subscriptions.push(categoriesSubscription);

    const searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
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
    const prevIndex = this.filteredLists.findIndex(
      (list) => list.items === event.previousContainer.data,
    );
    const currIndex = this.filteredLists.findIndex(
      (list) => list.items === event.container.data,
    );

    if (event.previousContainer === event.container) {
      this.isLoading = true;
      moveItemInArray(
        this.filteredLists[prevIndex].items,
        event.previousIndex,
        event.currentIndex,
      );
      this.itemService
        .reorderInCategory(this.filteredLists[currIndex].items.map((i) => i.id))
        .subscribe({
          next: () => {
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error reordering in category:', error);
            this.isLoading = false;
          },
        });
    } else {
      this.isLoading = true;
      const movedItem =
        this.filteredLists[prevIndex].items[event.previousIndex];
      const newCategoryId = this.filteredLists[currIndex].id;

      transferArrayItem(
        this.filteredLists[prevIndex].items,
        this.filteredLists[currIndex].items,
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
          this.itemService
            .reorderInCategory(
              this.filteredLists[currIndex].items.map((i) => i.id),
            )
            .subscribe({
              next: () => {
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error reordering in new category:', error);
                this.isLoading = false;
              },
            });
        },
        error: (error: any) => {
          transferArrayItem(
            this.filteredLists[currIndex].items,
            this.filteredLists[prevIndex].items,
            event.currentIndex,
            event.previousIndex,
          );
          this.isLoading = false;
        },
      });
    }
    this.syncFilteredListsToOriginal();
    this.cdr.detectChanges();
  }

  onListDropped(event: CdkDragDrop<any[]>) {
    this.isLoading = true;
    moveItemInArray(
      this.filteredLists,
      event.previousIndex,
      event.currentIndex,
    );

    this.cdr.detectChanges();
    this.itemService
      .reorderCategories(this.filteredLists.map((c) => c.id))
      .subscribe({
        next: (response: any) => {
          this.syncFilteredListsToOriginal();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error reordering categories:', error);
          moveItemInArray(
            this.filteredLists,
            event.currentIndex,
            event.previousIndex,
          );
          this.syncFilteredListsToOriginal();
          this.isLoading = false;
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
            item.price.toString().includes(this._searchTerm.toLowerCase()) ||
            item.ingredients
              .toLowerCase()
              .includes(this._searchTerm.toLowerCase()),
        ),
      }));
    }
  }

  private syncFilteredListsToOriginal(): void {
    this.lists = JSON.parse(JSON.stringify(this.filteredLists));
    this.filterItems();
  }
}
