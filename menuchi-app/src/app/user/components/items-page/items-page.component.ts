import { Component, OnInit, ViewChild } from '@angular/core';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';
import { ItemService } from '../../services/item/item.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ItemsTableComponent } from './items-table/items-table.component';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-items-page',
  standalone: false,
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.scss',
})
export class ItemsPageComponent implements OnInit {
  @ViewChild(ItemsTableComponent) itemsTable!: ItemsTableComponent;

  searchText: string = '';
  private searchInputSubject = new Subject<string>();

  constructor(
    private readonly titleService: TitleService,
    private readonly modalService: ModalService,
    private readonly itemService: ItemService,
    private readonly messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.titleService.onPageChanged$.next('آیتم‌های غذایی');

    this.searchInputSubject.pipe(debounceTime(500)).subscribe((searchValue) => {
      this.itemsTable.filterItems(searchValue);
    });
  }

  showModal(): void {
    this.modalService.openModal();
  }

  onSearchInputChange(searchValue: string): void {
    this.searchInputSubject.next(searchValue);
  }

  deleteItems() {
    const selectedItems = this.itemsTable.getSelectedItems();

    if (selectedItems.length === 0) {
      this.messageService.warning(' هیچ آیتمی برای حذف انتخاب نشده است!');
      return;
    }

    this.itemService.deleteItems(selectedItems).subscribe({
      next: () => {
        this.messageService.info(' آیتم‌های انتخاب شده با موفقیت حذف شدند.');
        this.itemService.geAllItems();
        this.itemsTable.setOfCheckedId.clear();
        this.itemsTable.refreshCheckedStatus();
      },
      error: (error) => {
        this.messageService.error(' مشکلی در حذف آیتم‌ها به وجود آمد!');
      },
    });
  }
}
