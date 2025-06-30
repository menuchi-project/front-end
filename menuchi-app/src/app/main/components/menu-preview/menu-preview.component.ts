// src/app/features/menu/components/menu-preview/menu-preview.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryName, Item } from '../../../user/models/Item';
import { MenuService } from '../../../user/services/menu/menu.service';
import { ItemService } from '../../../user/services/item/item.service';
import { ActivatedRoute } from '@angular/router';
import { MenuCategory, MenuPreview } from '../../../user/models/Menu';
import moment from 'jalali-moment';
import { TitleService } from '../../../shared/services/title/title.service';
import { OrderService } from '../../../user/services/order/order.service';

@Component({
  selector: 'app-menu-preview',
  standalone: false,
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss',
})
export class MenuPreviewComponent implements OnInit {
  categories: CategoryName[] = [];
  allItems: Item[] = [];
  itemsFilteredByDay: Item[] = [];
  finalFilteredItems: Item[] = [];
  menuId: string | null = null;
  menuPreviewData: MenuPreview | null = null;
  selectedDay: string;
  selectedCategoryId: string | null = null;
  itemQuantities: { [itemId: string]: number } = {};

  constructor(
    private readonly menuService: MenuService,
    private readonly itemService: ItemService,
    private readonly titleService: TitleService,
    private readonly route: ActivatedRoute,
    private readonly orderService: OrderService,
  ) {
    this.selectedDay = this.getCurrentPersianDayAbbreviation();
  }

  ngOnInit(): void {
    this.titleService.onPageChanged$.next('پیش‌نمایش منو');

    this.route.paramMap.subscribe((params) => {
      this.menuId = params.get('menuId');
      if (this.menuId) {
        this.getAndDisplayMenuPreview(this.menuId);
      } else {
        console.warn(
          'Menu ID not found in route parameters. Cannot display preview.',
        );
      }
    });

    this.itemService.catNamesData$.subscribe({
      next: (catNames: CategoryName[]) => {
        this.categories = catNames;
        console.log('Category Names from API:', this.categories);
      },
      error: (error) => {
        console.error('Error fetching category names:', error);
      },
    });
    this.itemService.getBacklogCatNames();
  }

  private getCurrentPersianDayAbbreviation(): string {
    const todayMoment = moment();
    const dayOfWeek = todayMoment.day();
    const persianWeekDaysMap: { [key: number]: string } = {
      6: 'sat',
      0: 'sun',
      1: 'mon',
      2: 'tue',
      3: 'wed',
      4: 'thu',
      5: 'fri',
    };
    return persianWeekDaysMap[dayOfWeek] || 'sat';
  }

  private getAndDisplayMenuPreview(menuId: string): void {
    this.menuService.getMenuPreview(menuId).subscribe({
      next: (data: MenuPreview) => {
        this.menuPreviewData = data;
        const collectedItems: Item[] = [];
        const days: (keyof MenuPreview)[] = [
          'sat',
          'sun',
          'mon',
          'tue',
          'wed',
          'thu',
          'fri',
        ];

        days.forEach((day) => {
          const categoriesForDay = this.menuPreviewData?.[day] as
            | MenuCategory[]
            | undefined;
          if (categoriesForDay && Array.isArray(categoriesForDay)) {
            categoriesForDay.forEach((category) => {
              if (category.items && Array.isArray(category.items)) {
                collectedItems.push(...category.items);
              }
            });
          }
        });

        const uniqueItemsMap = new Map<string, Item>();
        collectedItems.forEach((item) => uniqueItemsMap.set(item.id, item));
        this.allItems = Array.from(uniqueItemsMap.values());

        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching menu preview:', error);
      },
    });
  }

  onDaySelected(day: string): void {
    this.selectedDay = day;
    this.selectedCategoryId = null;
    this.applyFilters();
  }

  onCategorySelected(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  private applyFilters(): void {
    let itemsToFilter: Item[] = [];

    if (this.menuPreviewData) {
      const categoriesForSelectedDay = (this.menuPreviewData as any)[
        this.selectedDay
      ] as MenuCategory[] | undefined;
      if (categoriesForSelectedDay && Array.isArray(categoriesForSelectedDay)) {
        categoriesForSelectedDay.forEach((category) => {
          if (category.items && Array.isArray(category.items)) {
            itemsToFilter.push(...category.items);
          }
        });
      }
    }

    const uniqueItemsByDayMap = new Map<string, Item>();
    itemsToFilter.forEach((item) => uniqueItemsByDayMap.set(item.id, item));
    this.itemsFilteredByDay = Array.from(uniqueItemsByDayMap.values());

    if (this.selectedCategoryId) {
      this.finalFilteredItems = this.itemsFilteredByDay.filter(
        (item) => item.categoryId === this.selectedCategoryId,
      );
    } else {
      this.finalFilteredItems = this.itemsFilteredByDay;
    }
  }

  getItemQuantity(itemId: string): number {
    return this.itemQuantities[itemId] || 0;
  }

  onQuantityChange(event: { item: Item; newQuantity: number }) {
    const { item, newQuantity } = event;

    if (newQuantity < 1) {
      delete this.itemQuantities[item.id]; // Remove item if quantity is 0 or less
    } else if (newQuantity > 10) {
      // Optional: Prevent quantity from exceeding 10 if you want to enforce a max
      console.warn('Quantity cannot exceed 10.');
      return;
    } else {
      this.itemQuantities[item.id] = newQuantity;
    }

    this.sendOrderToBackend();
  }

  private sendOrderToBackend(): void {
    if (!this.menuId) {
      console.error('Cannot send order: menuId is not available.');
      return;
    }

    const orderItems = Object.entries(this.itemQuantities).map(
      ([itemId, amount]) => ({
        itemId: itemId,
        amount: amount,
      }),
    );

    if (orderItems.length === 0) {
      console.log('No items in cart to order.');
      return;
    }

    this.orderService.createOrder(this.menuId, orderItems).subscribe({
      next: (response: any) => {
        console.log('Order created successfully:', response);
        // Optionally, you might want to fetch and update the cart display here
        // this.fetchOrders();
      },
      error: (error: any) => {
        console.error('Error creating order:', error);
      },
    });
  }
}
