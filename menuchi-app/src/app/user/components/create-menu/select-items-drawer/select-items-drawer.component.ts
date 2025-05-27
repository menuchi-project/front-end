import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DrawerService } from '../../../services/drawer/drawer.service';
import { Category, CategoryWithItemsResponse } from '../../../models/Item';
import { ItemService } from '../../../services/item/item.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CATEGORIES } from '../../../../main/models/CatNameIcons';

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

  @Input() menuId!: string;
  @Input() cylinderId!: string;
  @Output() submitted = new EventEmitter<any>();

  selectedItemIds: Set<string> = new Set();
  allChecked: boolean = false;
  isSubmitting = false;
  selectedCategoryId: string | null = null;

  constructor(
    private readonly drawerService: DrawerService,
    private readonly itemService: ItemService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.itemService.categoriesData$.subscribe({
      next: (response: CategoryWithItemsResponse) => {
        this.panels = response.categories;
        this.setIcons();
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

  toggleAllItems() {
    this.allChecked = !this.allChecked;
    this.selectedItemIds.clear();
    if (this.allChecked) {
      this.panels.forEach((panel) =>
        panel.items.forEach((item) => this.selectedItemIds.add(item.id)),
      );
    }
  }

  isItemSelected(id: string): boolean {
    return this.selectedItemIds.has(id);
  }

  syncAllChecked() {
    const totalItems = this.panels.reduce(
      (acc, panel) => acc + panel.items.length,
      0,
    );
    this.allChecked = this.selectedItemIds.size === totalItems;
  }

  submit() {
    const selectedCategoryIds = new Set(
      this.panels.flatMap((panel) =>
        panel.items
          .filter((item) => this.selectedItemIds.has(item.id))
          .map(() => panel.id),
      ),
    );

    if (selectedCategoryIds.size > 1) {
      console.error('More than one category selected!');
      return;
    }

    this.isSubmitting = true;

    const selectedCategory = this.panels.find((panel) =>
      panel.items.some((item) => this.selectedItemIds.has(item.id)),
    );

    const categoryId = selectedCategory?.id;

    const body = {
      categoryId,
      cylinderId: this.cylinderId,
      items: Array.from(this.selectedItemIds),
    };

    this.submitted.emit({ menuId: this.menuId, body });

    setTimeout(() => {
      this.isSubmitting = false;
      this.close();
    }, 1000);
  }

  close() {
    this.drawerService.closeDrawer();
    this.selectedItemIds.clear();
    this.allChecked = false;
    this.selectedCategoryId = null;
  }

  toggleItemSelection(id: string, categoryId: string) {
    if (this.selectedCategoryId && this.selectedCategoryId !== categoryId) {
      this.selectedItemIds.clear();
      this.allChecked = false;
    }

    if (this.selectedItemIds.has(id)) {
      this.selectedItemIds.delete(id);
    } else {
      this.selectedItemIds.add(id);
    }

    this.selectedCategoryId = categoryId;
    this.syncAllChecked();
  }

  getSafeResourceUrl(url: string | undefined): SafeResourceUrl {
    if (url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  setIcons() {
    for (let i = 0; i < this.panels.length; i++) {
      let menuCat = this.panels[i];
      menuCat.icon = CATEGORIES.find(
        (c) => c.label == menuCat.categoryName,
      )?.icon;
      if (!menuCat.icon) menuCat.icon = 'assets/icons/categories/سالاد.svg';
    }
  }
}
