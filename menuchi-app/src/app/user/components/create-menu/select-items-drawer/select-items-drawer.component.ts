import { Component, OnInit } from '@angular/core';
import { DrawerService } from '../../../services/drawer/drawer.service';
import { Category, CategoryWithItemsResponse } from '../../../models/Item';
import { ItemService } from '../../../services/item/item.service';

@Component({
  selector: 'app-select-items-drawer',
  standalone: false,
  templateUrl: './select-items-drawer.component.html',
  styleUrl: './select-items-drawer.component.scss',
})
export class SelectItemsDrawerComponent implements OnInit {
  isVisible: boolean = false;
  panels: Category[] = [];

  loading: boolean = false;
  itemChecked: boolean = true;

  constructor(
    private readonly drawerService: DrawerService,
    private readonly itemService: ItemService,
  ) {}

  ngOnInit(): void {
    this.itemService.categoriesData$.subscribe({
      next: (response: CategoryWithItemsResponse) => {
        this.panels = response.categories;
      },
      error: (error) => {
        console.error('Drawer error in select item drawer:', error);
      },
    });
    this.drawerService.drawerOpens$.subscribe({
      next: (isOpen) => {
        this.isVisible = isOpen;
      },
      error: (error) =>
        console.error('Drawer error in select item drawer:', error),
    });

    this.itemService.getCategoriesWithItems();
  }
}
