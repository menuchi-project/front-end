import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../api-config/environment';
import { Order } from '../../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.API_URL + '/menus';

  constructor(private http: HttpClient) {}

  createOrder(
    menuId: string,
    items: { itemId: string; amount: number }[],
  ): Observable<any> {
    const payload = { items: items };
    return this.http.post(`${this.apiUrl}/${menuId}/orders`, payload);
  }

  getMenuOrders(menuId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/${menuId}/orders`);
  }
}
