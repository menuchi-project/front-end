import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Item } from '../../../models/Item';
import { ItemService } from '../../../services/item/item.service';

@Component({
  selector: 'app-items-table',
  standalone: false,
  templateUrl: './items-table.component.html',
  styleUrl: './items-table.component.scss',
})
export class ItemsTableComponent implements OnInit {
  listOfData: Item[] = [];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly Item[] = [];
  setOfCheckedId = new Set<string>();
  editCache: { [key: string]: { edit: boolean; data: Item } } = {};

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.itemsData$.subscribe({
      next: (response: Item[]) => {
        this.listOfData = response;
        this.updateEditCache();
      },
      error: (error) => {
        console.log('error in items table, line 29:', error);
      },
    });

    this.itemService.geAllItems();
    this.updateEditCache();
  }

  sortPrice = (a: Item, b: Item): number => a.price - b.price;
  sortName = (a: Item, b: Item): number => a.name.localeCompare(b.name, 'fa');
  sortCategory = (a: Item, b: Item): number =>
    a.categoryName.localeCompare(b.categoryName, 'fa');

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

  onCurrentPageDataChange($event: readonly Item[]): void {
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

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false,
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter((d) => d.id !== id);
  }
}
