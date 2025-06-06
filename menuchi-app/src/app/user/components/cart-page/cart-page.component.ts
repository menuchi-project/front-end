import { Component } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../api-config/environment';
import { Order } from '../../models/order';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list'; 
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  imports: [
    CommonModule,
    NzCardModule,
    NzListModule,
    NzImageModule,
    NzTypographyModule,
    NzEmptyModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CartPageComponent {
  orders: any[] = [];
  email: string = '';
  quantities: number[] = [1, 1, 1];

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.email = this.authService.getCustomerEmail() || '';
  }

  ngOnInit(): void {
  //  this.fetchOrders();
  }
  
  fetchOrders(): void {
    if (!this.email) {
      console.log('هیچ ایمیلی پیدا نشد، مشتری لاگین نکرده است');
      return;
    }
    const url = environment.API_URL + '/customer/orders';
    this.http.get<Order[]>(url).subscribe({
      next: (data) => {
        this.orders = data;
        if (this.orders.length === 0) {
          console.log('هیچ سفارشی وجود ندارد');
        } else {
          console.log('سفارش‌ها با موفقیت دریافت شدند:', this.orders);
        }
      },
      error: (err) => {
        console.error('خطا در دریافت سفارش‌ها:', err);
      }
    });
  }

  getTotalPrice(): number {
    return this.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  }

   increaseQuantity(index: number) {
    if (this.quantities[index] < 10) {
      this.quantities[index]++;
    }
  }

  decreaseQuantity(index: number) {
    if (this.quantities[index] > 1) {
      this.quantities[index]--;
    }
  }
}
