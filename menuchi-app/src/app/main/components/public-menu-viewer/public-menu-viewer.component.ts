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
  categories: any[] = []; // CategoryName[] but simplified for public view
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
    this.menuService.getMenuPreview(menuId).subscribe({
      next: (data: MenuPreview) => {
        this.menuPreviewData = data;
        console.log('Public Menu Preview Data:', this.menuPreviewData);

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
          const categoriesForDay = (this.menuPreviewData as any)?.[day] as
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

        // Extract unique categories from menuPreviewData across all days
        const uniqueCategoriesMap = new Map<
          string,
          { id: string; name: string; icon?: string }
        >();
        days.forEach((day) => {
          const categoriesForDay = (this.menuPreviewData as any)?.[day] as
            | MenuCategory[]
            | undefined;
          if (categoriesForDay && Array.isArray(categoriesForDay)) {
            categoriesForDay.forEach((cat) => {
              if (!uniqueCategoriesMap.has(cat.categoryId)) {
                uniqueCategoriesMap.set(cat.categoryId, {
                  id: cat.categoryId,
                  name: cat.categoryName,
                  icon: cat.icon,
                });
              }
            });
          }
        });
        this.categories = Array.from(uniqueCategoriesMap.values());

        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Error fetching public menu preview:', error);
        // Handle API error, e.g., display a user-friendly message
      },
    });
  }

  onDaySelected(day: string): void {
    this.selectedDay = day;
    this.selectedCategoryId = null; // Reset category filter on day change
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
      // If no category is selected, show all items for the selected day
      this.finalFilteredItems = this.itemsFilteredByDay;
    }
    console.log('Public Final Filtered Items:', this.finalFilteredItems);
  }
}
