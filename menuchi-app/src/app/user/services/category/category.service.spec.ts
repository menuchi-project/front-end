import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryName } from '../../models/Item';
import { environment } from '../../../../../api-config/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = environment.API_URL;

  private getCategoryNamesData = new Subject<CategoryName[]>();
  getCategoryNamesData$ = this.getCategoryNamesData.asObservable();

  constructor(private httpClient: HttpClient) {}

  getCategoryNames() {
    return this.httpClient
      .get<CategoryName[]>(this.apiUrl + '/category-names')
      .subscribe({
        next: (cats) => {
          this.getCategoryNamesData.next(cats);
        },
        error: (error) => {
          console.error('Failed to get category names:', error);
        },
      });
  }
}
