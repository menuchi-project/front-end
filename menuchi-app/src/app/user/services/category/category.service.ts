import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryName } from '../../models/Item';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // private readonly apiUrl = environment.apiUrl + '/api/Categories';
  private readonly apiUrl = 'http://localhost:8000';

  private getCategoryNamesData = new Subject<CategoryName[]>();
  getCategoryNamesData$ = this.getCategoryNamesData.asObservable();

  constructor(private httpClient: HttpClient) {}

  getCategoryNames() {
    return this.httpClient
      .get<CategoryName[]>(this.apiUrl + '/category-names')
      .subscribe((cats) => {
        this.getCategoryNamesData.next(cats);
      });
  }
}
