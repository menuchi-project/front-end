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
        console.log('hiiii', cats);
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

  createCategory(newItem: CreateItemRequest) {
    return this.httpClient.post(this.apiUrl, newItem).subscribe((res) => {
      console.log(res);
    });
  }

  // updateCategory(id: number, name: string) {
  //   this.loadingService.setLoading(true);
  //   console.log(name);
  //
  //   return this.httpClient.put(
  //     this.apiUrl,
  //     { id: id, name: name },
  //     {
  //       withCredentials: true,
  //     },
  //   );
  // }
  //
  // deleteCategory(id: number) {
  //   this.loadingService.setLoading(true);
  //   return this.httpClient.delete(this.apiUrl + `/${id}`, {
  //     withCredentials: true,
  //   });
  // }
  //
  // getAllCategories() {
  //   this.loadingService.setLoading(true);
  //   return this.httpClient.get<AllCategories[]>(
  //     this.apiUrl + `/all-category-without-pagination`,
  //     {
  //       withCredentials: true,
  //     },
  //   );
  // }
}
