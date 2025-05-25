import { Component, OnInit } from '@angular/core';
import { CATEGORIES } from '../../models/CatNameIcons';
import { Item } from '../../../user/models/Item';
import { ItemService } from '../../../user/services/item/item.service';

@Component({
  selector: 'app-menu-preview',
  standalone: false,
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss',
})
export class MenuPreviewComponent implements OnInit {
  categories = CATEGORIES;
  items!: Item[];

  constructor(private readonly itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.itemsData$.subscribe({
      next: (response: Item[]) => {
        this.items = response;
        this.items = this.items.slice(0, 5);
      },
      error: (error) => {
        console.log('error in preview, line 26:', error);
      },
    });

    this.itemService.geAllItems();
  }
}
