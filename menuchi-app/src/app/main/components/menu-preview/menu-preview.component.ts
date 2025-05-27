import { Component, OnInit } from '@angular/core';
import { CATEGORIES } from '../../models/CatNameIcons';
import { Item } from '../../../user/models/Item';
import { MenuService } from '../../../user/services/menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { MenuCategory, MenuPreview } from '../../../user/models/Menu';

@Component({
  selector: 'app-menu-preview',
  standalone: false,
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss',
})
export class MenuPreviewComponent implements OnInit {
  categories = CATEGORIES;
  allItems: Item[] = []; // Stores all unique items from the menu preview
  filteredItems: Item[] = []; // Items to display based on selected day
  menuId: string | null = null;
  menuPreviewData: MenuPreview | null = null;
  selectedDay: string = 'sat'; // Default to Saturday or the current day

  constructor(
    private readonly menuService: MenuService,
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

        // Get all unique items across all days
        const uniqueItemsMap = new Map<string, Item>();
        collectedItems.forEach((item) => uniqueItemsMap.set(item.id, item));
        this.allItems = Array.from(uniqueItemsMap.values());

        // Initially filter items for the default selected day (e.g., 'sat')
        this.filterItemsByDay(this.selectedDay);
      },
      error: (error) => {
        console.error('Error fetching menu preview:', error);
      },
    });
  }

  // New method to handle day selection from the calendar component
  onDaySelected(day: string): void {
    this.selectedDay = day;
    this.filterItemsByDay(day);
  }

  // New method to filter items based on the selected day
  private filterItemsByDay(day: string): void {
    if (!this.menuPreviewData) {
      this.filteredItems = [];
      return;
    }

    const categoriesForSelectedDay = (this.menuPreviewData as any)[day] as
      | MenuCategory[]
      | undefined;
    const itemsForSelectedDay: Item[] = [];

    if (categoriesForSelectedDay && Array.isArray(categoriesForSelectedDay)) {
      categoriesForSelectedDay.forEach((category) => {
        if (category.items && Array.isArray(category.items)) {
          itemsForSelectedDay.push(...category.items);
        }
      });
    }

    // Remove duplicates if items can appear in multiple categories within the same day
    const uniqueFilteredItemsMap = new Map<string, Item>();
    itemsForSelectedDay.forEach((item) =>
      uniqueFilteredItemsMap.set(item.id, item),
    );
    this.filteredItems = Array.from(uniqueFilteredItemsMap.values());

    console.log(`Items for ${day}:`, this.filteredItems);
  }
}
