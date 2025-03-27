import { ChangeDetectorRef, Component } from '@angular/core';
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
    { id: 'B', items: [{ name: 'Item 31' }, { name: 'Item 41' }] },
    { id: 'Bw', items: [{ name: 'Item 32' }, { name: 'Item 24' }] },
    { id: 'Be', items: [{ name: 'Item 33' }, { name: 'Item 43' }] },
    { id: 'Cf', items: [{ name: 'Item 54' }, { name: 'Item 64' }] },
    { id: 'Dg', items: [{ name: 'Item 75' }, { name: 'Item 85' }] },
    { id: 'fD', items: [{ name: 'Item 76' }, { name: 'Item 86' }] },
    { id: 'Dj', items: [{ name: 'Item 77' }, { name: 'Item 87' }] },
    { id: 'rD', items: [{ name: 'Item 78' }, { name: 'Item 88' }] },
    { id: 'eD', items: [{ name: 'Item 79' }, { name: 'Item 89' }] },
    { id: 'Df', items: [{ name: 'Item 70' }, { name: 'Item 80' }] },
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

    this.cdr.detectChanges();
  }

  onListDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);

    this.cdr.detectChanges();
  }

  constructor(private cdr: ChangeDetectorRef) {}
}
