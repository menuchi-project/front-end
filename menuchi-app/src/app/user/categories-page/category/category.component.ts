import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Data } from '../../items-page/items-table/items-table.component';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  loading: boolean = false;
  listOfData: Data[] = [
    {
      id: '0',
      name: 'Joe kkkkk',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      id: '4',
      name: 'Joe kd[pewk',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      id: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      id: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      id: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
  }
}
