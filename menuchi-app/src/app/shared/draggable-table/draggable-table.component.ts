import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface Data {
  id: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-draggable-table',
  standalone: false,
  templateUrl: './draggable-table.component.html',
  styleUrl: './draggable-table.component.scss',
})
export class DraggableTableComponent {
  readonly listOfData: Data[] = [
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
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly Data[] = [];
  setOfCheckedId = new Set<string>();

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value),
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly Data[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id),
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id),
      ) && !this.checked;
  }
}
