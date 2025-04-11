import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  GetUrlRequest,
  GetUrlResponse,
} from '../../../user/models/UploadImage';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private readonly apiUrl = 'http://localhost:8000' + '/s3';

  // private categoriesData = new Subject<CategoryWithItemsResponse>();
  // private itemsData = new Subject<Item[]>();
  // categoriesData$ = this.categoriesData.asObservable();
  // itemsData$ = this.itemsData.asObservable();

  constructor(private httpClient: HttpClient) {}

  getUrl(request: GetUrlRequest) {
    return this.httpClient
      .post<GetUrlResponse>(this.apiUrl + '/get-item-pic-url', request)
      .subscribe((response) => {
        console.log('getUrl in upload image service line 25:', response);
        // this.categoriesData.next(cats);
      });
  }
}
