import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {
  CategoryWithItemsResponse,
  CreateItemRequest,
  Item,
} from '../../models/Item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  // private readonly apiUrl = environment.apiUrl + '/api/Categories';
  private readonly apiUrl =
    'http://localhost:8000' + '/backlog/60f51c22-80f7-4807-a5cf-68aca0d8a2be';

  private categoriesData = new Subject<CategoryWithItemsResponse>();
  private itemsData = new Subject<Item[]>();
  categoriesData$ = this.categoriesData.asObservable();
  itemsData$ = this.itemsData.asObservable();

  constructor(private httpClient: HttpClient) {}

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
}
