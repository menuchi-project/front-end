import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../api-config/environment';
import { Order } from '../../models/order';
import { PersianNumberPipe } from '../../../shared/pipes/persian-number/persian-number.pipe';
import { TitleService } from '../../../shared/services/title/title.service';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit {
  orders: any[] = [];
  email: string = '';
  quantities: number[] = [1, 1, 1];
  persianNumberPipe = new PersianNumberPipe();

  constructor(
    private authService: AuthService,
    private titleService: TitleService,
    private http: HttpClient,
  ) {
    this.email = this.authService.getCustomerEmail() || '';
  }

  ngOnInit(): void {
    this.titleService.onPageChanged$.next('سبد خرید');
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
      },
    });
  }

  getTotalPrice(): number {
    return this.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  }

  increaseQuantity(index: number) {
    if (this.quantities[index] < 10) {
      this.quantities[index]++;
    }
    return this.persianNumberPipe.transform(this.quantities[index]);
  }

  decreaseQuantity(index: number) {
    if (this.quantities[index] > 1) {
      this.quantities[index]--;
    }
    return this.persianNumberPipe.transform(this.quantities[index]);
  }
}
