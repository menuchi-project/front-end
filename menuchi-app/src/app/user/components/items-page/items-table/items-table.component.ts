import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Item, UpdateItemRequest } from '../../../models/Item';
import { ItemService } from '../../../services/item/item.service';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  constructor(
    private itemService: ItemService,
    private imageService: NzImageService,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.itemService.geAllItems();

    this.itemService.itemsData$.subscribe({
      next: (response: Item[]) => {
        this.listOfData = response;
        this.updateEditCache();
      },
      error: (error) => {
        console.log('error in items table, line 29:', error);
      },
    });

    this.updateEditCache();
  }

  sortPrice = (a: Item, b: Item): number => a.price - b.price;
  sortName = (a: Item, b: Item): number => a.name.localeCompare(b.name, 'fa');
  sortCategory = (a: Item, b: Item): number =>
    a.categoryName.localeCompare(b.categoryName, 'fa');

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
    this.itemService.reorderInItemsList(this.listOfData.map((i) => i.id));
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
    const editedItem = this.editCache[id].data;

    const updatePayload: UpdateItemRequest = {
      name: editedItem.name,
      ingredients: editedItem.ingredients,
      price: editedItem.price,
      categoryId: editedItem.categoryId,
      subCategoryId: editedItem.subCategoryId,
      picKey: null,
    };

    this.itemService.updateItem(editedItem.id, updatePayload).subscribe({
      next: () => {
        const index = this.listOfData.findIndex((item) => item.id === id);
        if (index !== -1) {
          Object.assign(this.listOfData[index], editedItem);
          this.editCache[id] = {
            edit: false,
            data: { ...editedItem },
          };
          this.messageService.success(' آیتم با موفقیت ویرایش شد.');
        }
      },
      error: (error) => {
        this.messageService.error(' مشکلی در ویرایش آیتم به وجود آمد!');
        console.error(' خطا هنگام ذخیره آیتم:', error);
      },
    });
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
    this.itemService.deleteItems([id]).subscribe({
      next: () => {
        this.messageService.info(' آیتم با موفقیت حذف شد.');
        this.itemService.geAllItems();
      },
      error: (error) => {
        this.messageService.error(' مشکلی در حذف آیتم به وجود آمد!');
      },
    });
  }

  showImage(picUrl: string) {
    this.imageService.preview(
      [
        {
          src: picUrl,
        },
      ],
      { nzZoom: 1.5, nzRotate: 0 },
    );
  }

  getSelectedItems(): string[] {
    return Array.from(this.setOfCheckedId);
  }
}
