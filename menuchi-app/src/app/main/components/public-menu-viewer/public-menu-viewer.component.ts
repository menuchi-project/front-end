import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'jalali-moment';
import { MenuCategory, MenuPreview } from '../../../user/models/Menu';
import { Item } from '../../../user/models/Item';
import { MenuService } from '../../../user/services/menu/menu.service';

@Component({
  selector: 'app-public-menu-viewer',
  standalone: false,
  templateUrl: './public-menu-viewer.component.html',
  styleUrls: ['./public-menu-viewer.component.scss'],
})
export class PublicMenuViewerComponent implements OnInit {
  menuId: string | null = null;
  menuPreviewData: MenuPreview | null = null;
  categories: any[] = [];
  allItems: Item[] = [];
  itemsFilteredByDay: Item[] = [];
  finalFilteredItems: Item[] = [];
  selectedDay: string;

  selectedCategoryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
  ) {
    this.selectedDay = this.getCurrentPersianDayAbbreviation();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.menuId = params.get('menuId');
      if (this.menuId) {
        this.getAndDisplayMenuPreview(this.menuId);
      } else {
        console.error('Menu ID not found in route parameters.');
      }
    });
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
    this.menuService.getPublicMenu(menuId).subscribe({
      next: (data: MenuPreview) => {
        this.menuPreviewData = data;

        this.categories = [];
        this.allItems = [];

        const collectedItems: Item[] = [];
        const uniqueCategoriesMap = new Map<
          string,
          { id: string; name: string; icon?: string }
        >();

        if (
          data.currentDay &&
          data.menuCategories &&
          Array.isArray(data.menuCategories)
        ) {
          this.selectedDay = data.currentDay;

          data.menuCategories.forEach((category) => {
            if (category.items && Array.isArray(category.items)) {
              collectedItems.push(...category.items);
            }
            if (!uniqueCategoriesMap.has(category.categoryId)) {
              uniqueCategoriesMap.set(category.categoryId, {
                id: category.categoryId,
                name: category.categoryName,
                icon: category.icon,
              });
            }
          });
        } else {
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
            const categoriesForDay = (this.menuPreviewData as any)?.[day] as
              | MenuCategory[]
              | undefined;
            if (categoriesForDay && Array.isArray(categoriesForDay)) {
              categoriesForDay.forEach((category) => {
                if (category.items && Array.isArray(category.items)) {
                  collectedItems.push(...category.items);
                }
                if (!uniqueCategoriesMap.has(category.categoryId)) {
                  uniqueCategoriesMap.set(category.categoryId, {
                    id: category.categoryId,
                    name: category.categoryName,
                    icon: category.icon,
                  });
                }
              });
            }
          });
        }

        const uniqueItemsMap = new Map<string, Item>();
        collectedItems.forEach((item) => uniqueItemsMap.set(item.id, item));
        this.allItems = Array.from(uniqueItemsMap.values());
        this.categories = Array.from(uniqueCategoriesMap.values());
        console.log('Categories for scroller:', this.categories); // Add this log

        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Error fetching public menu preview:', error);
      },
    });
  }

  onDaySelected(day: string): void {
    this.selectedDay = day;
    this.selectedCategoryId = null;
    this.applyFilters();
  }

  onCategorySelected(categoryId: string): void {
    console.log('Category selected event received:', categoryId); // Add this log
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
}
