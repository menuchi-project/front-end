import { Component } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../api-config/environment';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  imports: [
    CommonModule,
  ],
})
export class CartPageComponent {
  orders: any[] = [];
  email: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.email = this.authService.getCustomerEmail() || '';
  }

  ngOnInit(): void {
    this.fetchOrders();
  }
  
  fetchOrders(): void {
    if (!this.email) {
      console.log('هیچ ایمیلی پیدا نشد، مشتری لاگین نکرده است');
      return;
    }
    const url = environment.API_URL + '/customer/orders';
    this.http.get<any[]>(url).subscribe({
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
}
