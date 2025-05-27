import { Component, OnInit } from '@angular/core';
import { CategoryName, Item } from '../../../user/models/Item';
import { MenuService } from '../../../user/services/menu/menu.service';
import { ItemService } from '../../../user/services/item/item.service';
import { ActivatedRoute } from '@angular/router';
import { MenuCategory, MenuPreview } from '../../../user/models/Menu';

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
  selectedDay: string = 'sat';
  selectedCategoryId: string | null = null;

  constructor(
    private readonly menuService: MenuService,
    private readonly itemService: ItemService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
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

  private getAndDisplayMenuPreview(menuId: string): void {
    this.menuService.getMenuPreview(menuId).subscribe({
      next: (data: MenuPreview) => {
        this.menuPreviewData = data;
        console.log('Menu Preview Data:', this.menuPreviewData);

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
    console.log('Final Filtered Items:', this.finalFilteredItems);
  }
}
