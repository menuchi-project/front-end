import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Order, OrderItem } from '../../models/order';
import { PersianNumberPipe } from '../../../shared/pipes/persian-number/persian-number.pipe';
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
  // quantities: number[] = [1, 1, 1]; // This will be replaced by itemQuantities
  itemQuantities: { [itemId: string]: number } = {}; // To store quantities of items in the cart
  persianNumberPipe = new PersianNumberPipe();
  menuId: string | null = null; // To get menuId from route

  constructor(
    private authService: AuthService,
    private titleService: TitleService,
    private http: HttpClient,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private orderService: OrderService, // Inject OrderService
  ) {
    this.email = this.authService.getCustomerEmail() || '';
  }

  ngOnInit(): void {
    this.titleService.onPageChanged$.next('سبد خرید');
    this.route.paramMap.subscribe((params) => {
      this.menuId = params.get('menuId');
      if (this.menuId) {
        this.fetchOrders(); // Fetch orders only if menuId is available
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
    // You should use the getPublicMenu or a specific order fetching API if available for the customer directly
    // based on the backend API, you might need to adjust this.
    // For now, let's assume we can fetch orders for a specific menu.
    if (this.menuId) {
      this.orderService.getMenuOrders(this.menuId).subscribe({
        // Use orderService to fetch orders for the menuId
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
        // Assuming orderItem.id is the itemId and orderItem.amount is the quantity
        this.itemQuantities[orderItem.id] =
          (this.itemQuantities[orderItem.id] || 0) +
          parseInt(orderItem.amount as string); // Ensure amount is number
      });
    });
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    this.orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        totalPrice += orderItem.price * parseInt(orderItem.amount as string); // Calculate total price based on individual item price and amount
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
      // You might want to send an empty order or delete the existing one if all items are removed
      return;
    }

    // Assuming you have an API to update an existing order or create a new one with updated items
    // For simplicity, we'll use the createOrder endpoint. In a real application, you'd likely
    // have a PATCH or PUT endpoint for updating an existing order.
    this.orderService.createOrder(this.menuId, orderItems).subscribe({
      next: (response) => {
        console.log('Order updated successfully:', response);
        this.fetchOrders(); // Refresh orders after update
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
      categoryId: '', // You might need to fetch this or handle it differently if not available in OrderItem
      subCategoryId: '', // Same as above
      categoryName: '', // Same as above
      name: orderItem.name,
      ingredients: orderItem.ingredients,
      price: orderItem.price,
      picUrl: orderItem.pikUrl, // Correcting the typo from API to match Item interface
      positionInItemsList: 0, // Placeholder
      positionInCategory: 0, // Placeholder
      orderCount: 0, // Placeholder
    };
  }

  getTotalItemCount(): number {
    return Object.values(this.itemQuantities).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
  }
}
