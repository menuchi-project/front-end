import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
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
  categoriesData$ = this.categoriesData.asObservable();
  itemsData$ = this.itemsData.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    const backlogId = this.authService.getBacklogId();
    if (backlogId) this.apiUrl = environment.API_URL + '/backlog/' + backlogId;
  }

  ngOnInit() {}

  getCategoriesWithItems() {
    return this.httpClient
      .get<CategoryWithItemsResponse>(this.apiUrl)
      .subscribe((cats) => {
        this.categoriesData.next(cats);
      });
  }

  geAllItems() {
    return this.httpClient
      .get<Item[]>(this.apiUrl + '/items')
      .subscribe((items) => {
        this.itemsData.next(items);
      });
  }

  createItem(newItem: CreateItemRequest) {
    return this.httpClient.post(this.apiUrl + '/items', newItem);
  }

  deleteItems(itemIds: string[]) {
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

  reorderInCategory(itemIds: string[]) {
    this.httpClient
      .patch(this.apiUrl + '/reorder-items/in-category', itemIds)
      .subscribe((r) => {
        console.log(r);
      });
  }

  reorderInItemsList(itemIds: string[]) {
    this.httpClient
      .patch(this.apiUrl + '/reorder-items/in-list', itemIds)
      .subscribe((r) => {
        console.log(r);
      });
  }

  reorderCategories(catIds: string[]) {
    this.httpClient
      .patch(this.apiUrl + '/reorder-categories', catIds)
      .subscribe((r) => {
        console.log(r);
      });
  }
}
