import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Category, CategoryWithItemsResponse } from '../../models/Item';
import { ItemService } from '../../services/item/item.service';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DrawerService } from '../../services/drawer/drawer.service';
import { MenuService } from '../../services/menu/menu.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-menu',
  standalone: false,
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.scss',
})
export class CreateMenuComponent implements OnInit {
  @Output() addCategory = new EventEmitter<string>();
  lists: Category[] = [];
  selectedCategoryForModal: string | null = null;
  menuId!: string;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly itemService: ItemService,
    private readonly titleService: TitleService,
    private readonly modalService: ModalService,
    private readonly drawerService: DrawerService,
    private readonly menuService: MenuService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.itemService.categoriesData$.subscribe({
      next: (response: CategoryWithItemsResponse) => {
        this.lists = response.categories;
      },
      error: (error) => {
        console.log('error in create menu page, line 40:', error);
      },
    });

    this.itemService.getCategoriesWithItems();
    this.menuService.createMenu({
      name: 'بدون نام',
      favicon: 'todo',
      isPublished: false,
      branchId: this.authService.getBranchId()!,
    });
    this.titleService.onPageChanged$.next('ایجاد منوی جدید');
  }

  onListDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);

    this.cdr.detectChanges();
  }

  showModal(): void {
    this.modalService.openModal();
  }

  openModalForCategory(categoryId: string): void {
    this.selectedCategoryForModal = categoryId;
    this.modalService.openModal();
  }

  showAddCategoryModal() {
    this.addCategory.emit('this.list.categoryNameId');
  }

  showDrawer() {
    this.drawerService.openDrawer();
  }

  openDaysModal(): void {
    this.modalService.openModal();
  }
}
