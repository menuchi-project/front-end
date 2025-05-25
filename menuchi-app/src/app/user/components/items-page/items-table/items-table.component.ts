import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoryName, Item, UpdateItemRequest } from '../../../models/Item';
import { ItemService } from '../../../services/item/item.service';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-items-table',
  standalone: false,
  templateUrl: './items-table.component.html',
  styleUrl: './items-table.component.scss',
})
export class ItemsTableComponent implements OnInit {
  listOfData: Item[] = [];
  fullListOfData: Item[] = [];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly Item[] = [];
  setOfCheckedId = new Set<string>();
  editCache: { [key: string]: { edit: boolean; data: Item } } = {};
  categories: CategoryName[] = [];

  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageIndex: number = 1;

  constructor(
    private itemService: ItemService,
    private imageService: NzImageService,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.itemService.geAllItems();

    this.itemService.itemsData$.subscribe({
      next: (response: Item[]) => {
        this.fullListOfData = response;
        this.listOfData = [...this.fullListOfData];
        this.updateEditCache();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('error in items table, line 40:', error);
      },
    });

    this.itemService.getBacklogCatNames();

    this.itemService.catNamesData$.subscribe({
      next: (response: CategoryName[]) => {
        this.categories = response;
        this.updateEditCache();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log('error in items table, line 53:', error);
      },
    });
  }

  filterItems(searchText: string): void {
    if (!searchText) {
      this.listOfData = [...this.fullListOfData];
    } else {
      const lowerCaseSearchText = searchText.toLowerCase();
      this.listOfData = this.fullListOfData.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseSearchText) ||
          item.price.toString().includes(lowerCaseSearchText) ||
          item.categoryName.toLowerCase().includes(lowerCaseSearchText) ||
          item.ingredients.toLowerCase().includes(lowerCaseSearchText),
      );
    }
    this.pageIndex = 1;
    this.cdr.detectChanges();
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

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.cdr.detectChanges();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.listOfData = [...this.listOfData];
    this.cdr.detectChanges();
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

    const selectedCategory = this.categories.find(
      (cat) => cat.id === editedItem.categoryId,
    );

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
          if (selectedCategory) {
            this.listOfData[index].categoryName = selectedCategory.name;
          }
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
      { nzZoom: 1, nzRotate: 0 },
    );
  }

  getSelectedItems(): string[] {
    return Array.from(this.setOfCheckedId);
  }
}
