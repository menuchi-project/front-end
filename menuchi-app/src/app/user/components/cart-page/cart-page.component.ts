import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Order, OrderItem } from '../../models/order';
import { TitleService } from '../../../shared/services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { Item } from '../../models/Item';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit {
  orders: Order[] = [];
  email: string = '';
  itemQuantities: { [itemId: string]: number } = {};
  menuId: string | null = null;

  constructor(
    private authService: AuthService,
    private titleService: TitleService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private orderService: OrderService,
  ) {
    this.email = this.authService.getCustomerEmail() || '';
  }

  ngOnInit(): void {
    this.titleService.onPageChanged$.next('سبد خرید');
    this.route.paramMap.subscribe((params) => {
      this.menuId = params.get('menuId');
      if (this.menuId) {
        this.fetchOrders();
      } else {
        console.warn(
          'Menu ID not found in route parameters. Cannot fetch orders.',
        );
      }
    });
  }

  fetchOrders(): void {
    if (!this.email) {
      console.log('هیچ ایمیلی پیدا نشد، مشتری لاگین نکرده است');
      return;
    }

    if (this.menuId) {
      this.orderService.getMenuOrders(this.menuId).subscribe({
        next: (data: any) => {
          this.orders = data;
          if (this.orders.length === 0) {
            console.log('هیچ سفارشی وجود ندارد');
          } else {
            console.log('سفارش‌ها با موفقیت دریافت شدند:', this.orders);
            this.initializeItemQuantities();
          }
        },
        error: (err: any) => {
          console.error('خطا در دریافت سفارش‌ها:', err);
        },
      });
    }
  }

  initializeItemQuantities(): void {
    this.itemQuantities = {};
    this.orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        this.itemQuantities[orderItem.id] =
          (this.itemQuantities[orderItem.id] || 0) +
          parseInt(orderItem.amount as string);
      });
    });
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    this.orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        totalPrice += orderItem.price * parseInt(orderItem.amount as string);
      });
    });
    return totalPrice;
  }

  onQuantityChange(event: { item: Item; newQuantity: number }) {
    const { item, newQuantity } = event;

    if (newQuantity < 1) {
      delete this.itemQuantities[item.id];
    } else if (newQuantity > 10) {
      console.warn('Quantity cannot exceed 10.');
      return;
    } else {
      this.itemQuantities[item.id] = newQuantity;
    }
    this.sendOrderUpdateToBackend();
  }

  sendOrderUpdateToBackend(): void {
    if (!this.menuId) {
      console.error('Cannot update order: menuId is not available.');
      return;
    }

    const orderItems = Object.entries(this.itemQuantities).map(
      ([itemId, amount]) => ({
        itemId: itemId,
        amount: amount,
      }),
    );

    if (orderItems.length === 0) {
      console.log('No items in cart to update order.');
      return;
    }

    this.orderService.createOrder(this.menuId, orderItems).subscribe({
      next: (response) => {
        console.log('Order updated successfully:', response);
        this.fetchOrders();
      },
      error: (error) => {
        console.error('Error updating order:', error);
      },
    });
  }

  mapOrderItemToItem(orderItem: OrderItem): Item {
    return {
      id: orderItem.id,
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
      deletedAt: orderItem.deletedAt,
      categoryId: '',
      subCategoryId: '',
      categoryName: '',
      name: orderItem.name,
      ingredients: orderItem.ingredients,
      price: orderItem.price,
      picUrl: orderItem.pikUrl,
      positionInItemsList: 0,
      positionInCategory: 0,
      orderCount: 0,
    };
  }

  getTotalItemCount(): number {
    return Object.values(this.itemQuantities).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
  }
}
