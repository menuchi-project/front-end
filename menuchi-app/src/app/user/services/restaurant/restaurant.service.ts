import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../api-config/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private baseUrl = `${environment.API_URL}/restaurants`;

  constructor(private http: HttpClient) {}

  getRestaurantDetails(restaurantId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${restaurantId}`);
  }
}
