import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DrawerService } from '../../services/drawer/drawer.service';
import { MenuService } from '../../services/menu/menu.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Cylinder, Menu } from '../../models/Menu';

@Component({
  selector: 'app-create-menu',
  standalone: false,
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.scss',
})
export class CreateMenuComponent implements OnInit {
  @Output() addCategory = new EventEmitter<string>();
  cylinders: Cylinder[] = [];
  selectedCategoryForModal: string | null = null;
  menuId!: string;
  menu!: Menu;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly titleService: TitleService,
    private readonly modalService: ModalService,
    private readonly drawerService: DrawerService,
    private readonly menuService: MenuService,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.menuService.currentMenuData$.subscribe({
      next: (response: Menu) => {
        this.menu = response;
        this.cylinders = response.cylinders;
        console.log(this.menu);
      },
      error: (error) => {
        console.log('error in create menu page, line 47:', error);
      },
    });

    this.menuService
      .createMenu({
        name: 'بدون نام',
        favicon: 'todo',
        isPublished: false,
        branchId: this.authService.getBranchId()!,
      })
      .subscribe({
        next: (response) => {
          this.menuId = response.id;
          this.menuService.getMenuById(this.menuId);
          console.log(this.menuId);
        },
        error: (error) => {
          console.log('error in create menu:', error);
          this.messageService.error(' ' + error.error.message);
        },
      });

    this.titleService.onPageChanged$.next('ایجاد منوی جدید');
  }

  onListDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.cylinders, event.previousIndex, event.currentIndex);
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
