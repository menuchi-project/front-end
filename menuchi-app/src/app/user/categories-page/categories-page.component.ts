import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-categories-page',
  standalone: false,
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
})
export class CategoriesPageComponent {
  lists = [
    {
      id: 'A',
      items: [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 1' },
        { name: 'Item 2' },
      ],
    },
    { id: 'B', items: [{ name: 'Item 3' }, { name: 'Item 4' }] },
    { id: 'C', items: [{ name: 'Item 5' }, { name: 'Item 6' }] },
    { id: 'D', items: [{ name: 'Item 7' }, { name: 'Item 8' }] },
  ];

  allConnectedLists = this.lists.map((l) => l.id);

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
  }
}
