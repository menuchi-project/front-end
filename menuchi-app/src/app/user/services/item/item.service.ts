import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
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
export class ItemService implements OnInit {
  private readonly apiUrl!: string;

  private categoriesData = new Subject<CategoryWithItemsResponse>();
  private itemsData = new Subject<Item[]>();
  private catNamesData = new Subject<CategoryName[]>();
  categoriesData$ = this.categoriesData.asObservable();
  itemsData$ = this.itemsData.asObservable();
  catNamesData$ = this.catNamesData.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    const backlogId = this.authService.getBacklogId();
    if (backlogId) this.apiUrl = environment.API_URL + '/backlog/' + backlogId;
  }

  ngOnInit() {}

  getCategoriesWithItems(): Observable<CategoryWithItemsResponse> {
    return this.httpClient.get<CategoryWithItemsResponse>(this.apiUrl);
  }

  geAllItems() {
    return this.httpClient
      .get<Item[]>(this.apiUrl + '/items')
      .subscribe((items) => {
        this.itemsData.next(items);
      });
  }

  createItem(newItem: CreateItemRequest): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/items', newItem);
  }

  deleteItems(itemIds: string[]): Observable<any> {
    const options = {
      body: itemIds,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.delete(this.apiUrl + '/items', options);
  }

  updateItem(itemId: string, newItem: UpdateItemRequest): Observable<void> {
    return this.httpClient.patch<void>(
      `${this.apiUrl}/items/${itemId}`,
      newItem,
    );
  }

  getBacklogCatNames() {
    return this.httpClient
      .get<CategoryName[]>(this.apiUrl + '/category-names')
      .subscribe((cats) => {
        this.catNamesData.next(cats);
      });
  }

  reorderInCategory(itemIds: string[]): Observable<any> {
    return this.httpClient.patch(
      this.apiUrl + '/reorder-items/in-category',
      itemIds,
    );
  }

  reorderInItemsList(itemIds: string[]): Observable<any> {
    return this.httpClient.patch(
      this.apiUrl + '/reorder-items/in-list',
      itemIds,
    );
  }

  reorderCategories(catIds: string[]): Observable<any> {
    return this.httpClient.patch(this.apiUrl + '/reorder-categories', catIds);
  }
}
