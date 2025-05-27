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
  items: Item[] = [];
  menuId: string | null = null;
  menuPreviewData: MenuPreview | null = null;

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
        // Optionally, redirect or show an error message to the user
      }
    });
  }

  private getAndDisplayMenuPreview(menuId: string): void {
    this.menuService.getMenuPreview(menuId).subscribe({
      next: (data: MenuPreview) => {
        this.menuPreviewData = data;
        console.log('Menu Preview Data:', this.menuPreviewData);

        this.items = [];

        const days: (keyof MenuPreview)[] = [
          'sat',
          'sun',
          'mon',
          'tue',
          'wed',
          'thu',
          'fri',
        ];
        const collectedItems: Item[] = [];

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

        // Remove duplicates if an item can appear in multiple categories/days
        const uniqueItemsMap = new Map<string, Item>();
        collectedItems.forEach((item) => uniqueItemsMap.set(item.id, item));
        this.items = Array.from(uniqueItemsMap.values());

        // اگر می‌خواهید فقط 5 آیتم اول را نمایش دهید، اینجا برش دهید:
        // this.items = this.items.slice(0, 5); // اگر می‌خواهید فقط 5 آیتم نمایش داده شود
      },
      error: (error) => {
        console.error('Error fetching menu preview:', error);
        // Handle error, e.g., show a message to the user
      },
    });
  }
}
