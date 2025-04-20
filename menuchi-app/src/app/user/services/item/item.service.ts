import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {
  CategoryWithItemsResponse,
  CreateItemRequest,
  Item,
} from '../../models/Item';
import { environment } from '../../../../../api-config/api-url';
import { AuthService } from '../../../main/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService implements OnInit {
  private apiUrl!: string;

  private categoriesData = new Subject<CategoryWithItemsResponse>();
  private itemsData = new Subject<Item[]>();
  categoriesData$ = this.categoriesData.asObservable();
  itemsData$ = this.itemsData.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const backlogId = this.authService.getBacklogId();
    if (backlogId) this.apiUrl = environment.apiUrl + '/backlog/' + backlogId;
    console.log('dd', this.apiUrl);
  }

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
