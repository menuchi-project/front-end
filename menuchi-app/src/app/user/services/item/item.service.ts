import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import {
  CategoryName,
  CategoryWithItemsResponse,
  CreateItemRequest,
  Item,
  UpdateItemRequest,
} from '../../models/Item';
import { AuthService } from '../../../main/services/auth/auth.service';
import { environment } from '../../../../../api-config/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl: string | null = null;

  private categoriesData = new BehaviorSubject<CategoryWithItemsResponse>({
    id: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
    branchId: '',
    categories: [],
  });
  private itemsData = new Subject<Item[]>();
  private catNamesData = new Subject<CategoryName[]>();
  categoriesData$ = this.categoriesData.asObservable();
  itemsData$ = this.itemsData.asObservable();
  catNamesData$ = this.catNamesData.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  public initialize(): void {
    if (!this.apiUrl) {
      const backlogId = this.authService.getBacklogId();
      if (backlogId) {
        this.apiUrl = environment.API_URL + '/backlog/' + backlogId;
        this.loadInitialCategories();
      } else {
        console.error(
          'Backlog ID not found, ItemService could not be initialized.',
        );
      }
    }
  }

  private loadInitialCategories(): void {
    if (this.apiUrl) {
      this.getCategoriesWithItems().subscribe({
        error: (error) =>
          console.error('Error loading initial categories:', error),
      });
    }
  }

  getCategoriesWithItems(): Observable<CategoryWithItemsResponse> {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient
      .get<CategoryWithItemsResponse>(this.apiUrl)
      .pipe(tap((cats) => this.categoriesData.next(cats)));
  }

  getBacklogCatNames() {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient
      .get<CategoryName[]>(this.apiUrl + '/category-names')
      .subscribe((cats) => this.catNamesData.next(cats));
  }

  geAllItems() {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient
      .get<Item[]>(this.apiUrl + '/items')
      .subscribe((items) => this.itemsData.next(items));
  }

  createItem(newItem: CreateItemRequest): Observable<any> {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient.post(this.apiUrl + '/items', newItem);
  }

  deleteItems(itemIds: string[]): Observable<any> {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient.delete(this.apiUrl + '/items', { body: itemIds });
  }

  updateItem(itemId: string, newItem: UpdateItemRequest): Observable<void> {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient.patch<void>(
      `${this.apiUrl}/items/${itemId}`,
      newItem,
    );
  }

  reorderInCategory(itemIds: string[]): Observable<any> {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient.patch(
      this.apiUrl + '/reorder-items/in-category',
      itemIds,
    );
  }

  reorderInItemsList(itemIds: string[]): Observable<any> {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient.patch(
      this.apiUrl + '/reorder-items/in-list',
      itemIds,
    );
  }

  reorderCategories(catIds: string[]): Observable<any> {
    if (!this.apiUrl) throw new Error('ItemService not initialized.');
    return this.httpClient.patch(this.apiUrl + '/reorder-categories', catIds);
  }
}
