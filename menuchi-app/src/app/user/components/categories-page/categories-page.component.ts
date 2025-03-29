import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ItemService } from '../../services/item/item.service';
import { Category, CategoryWithItemsResponse } from '../../models/Item';
import { log } from 'ng-zorro-antd/core/logger';

@Component({
  selector: 'app-categories-page',
  standalone: false,
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
})
export class CategoriesPageComponent implements OnInit {
  lists: Category[] = [];
  allConnectedLists: string[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private itemService: ItemService,
  ) {}

  ngOnInit(): void {
    this.itemService.categoriesData$.subscribe({
      next: (response: CategoryWithItemsResponse) => {
        this.lists = response.categories;
        this.allConnectedLists = this.lists.map((l) => l.id);
        console.log(this.lists);
      },
      error: (error) => {
        console.log('errrror', error);
      },
    });

    this.itemService.getCategoriesWithItems();
  }

  onItemDropped(event: CdkDragDrop<any[]>) {
    const prevIndex = this.lists.findIndex(
      (list) => list.items === event.previousContainer.data,
    );
    const currIndex = this.lists.findIndex(
      (list) => list.items === event.container.data,
    );

    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.lists[prevIndex].items,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        this.lists[prevIndex].items,
        this.lists[currIndex].items,
        event.previousIndex,
        event.currentIndex,
      );
    }

    console.log(prevIndex, currIndex);
    console.log(this.lists);

    this.cdr.detectChanges();
  }

  onListDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);

    this.cdr.detectChanges();
  }
}
