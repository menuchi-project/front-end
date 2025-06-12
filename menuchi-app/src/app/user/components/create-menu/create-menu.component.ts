import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DrawerService } from '../../services/drawer/drawer.service';
import { MenuService } from '../../services/menu/menu.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Cylinder, Menu, WeekDays } from '../../models/Menu';
import { CATEGORIES } from '../../../main/models/CatNameIcons';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-create-menu',
  standalone: false,
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.scss',
})
export class CreateMenuComponent implements OnInit {
  cylinders: Cylinder[] = [];
  selectedCategoryForModal: string | null = null;
  menuId!: string;
  menu!: Menu;
  selectedCylinderId: string = '';
  existingDays: string[] = [];

  private nameUpdate = new Subject<string>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly titleService: TitleService,
    private readonly modalService: ModalService,
    private readonly drawerService: DrawerService,
    private readonly menuService: MenuService,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
  ) {
    this.nameUpdate
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((name) => {
        this.updateMenuName(name);
      });
  }

  ngOnInit(): void {
    this.authService.fetchUserProfile();

    const savedMenuId = localStorage.getItem('currentCreatingMenuId');
    if (savedMenuId) {
      this.menuId = savedMenuId;
      this.menuService.getMenuById(this.menuId);
    } else {
      this.menuService
        .createMenu({
          name: '',
          favicon: 'todo',
          isPublished: false,
          branchId: this.authService.getBranchId()!,
        })
        .subscribe({
          next: (response) => {
            this.menuId = response.id;
            localStorage.setItem('currentCreatingMenuId', this.menuId);
            this.menuService.getMenuById(this.menuId);
          },
          error: (error) => {
            console.log('error in create menu:', error);
            this.messageService.error(' ' + error.error.message);
          },
        });
    }

    this.titleService.onPageChanged$.next('ایجاد منوی جدید');

    this.menuService.currentMenuData$.subscribe({
      next: (response: Menu) => {
        this.menu = response;
        this.cylinders = response.cylinders;
        this.updateExistingDays();
        console.log('current menu:', this.menu);

        this.setIcons();
      },
      error: (error) => {
        console.log('error in create menu page, line 47:', error);
      },
    });
  }

  onNameChange(): void {
    if (this.menu && this.menu.name) {
      this.nameUpdate.next(this.menu.name);
    }
  }

  updateMenuName(name: string): void {
    if (!this.menuId || !name) {
      return;
    }
    this.menuService.updateMenu(this.menuId, { name }).subscribe({
      next: () => {
        this.messageService.success(' نام منو ذخیره شد');
      },
      error: (err) => {
        console.error(' خطا در به‌روزرسانی نام منو:', err);
        this.messageService.error(' خطا در ذخیره نام منو');
      },
    });
  }

  setIcons() {
    for (let cyl of this.cylinders) {
      for (let i = 0; i < cyl.menuCategories.length; i++) {
        let menuCat = cyl.menuCategories[i];
        menuCat.icon = CATEGORIES.find(
          (c) => c.label == menuCat.categoryName,
        )?.icon;
        if (!menuCat.icon) menuCat.icon = 'assets/icons/categories/سالاد.svg';
      }
    }
  }

  onListDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.cylinders, event.previousIndex, event.currentIndex);
    this.cdr.detectChanges();
  }

  openModalForCategory(categoryId: string): void {
    this.selectedCategoryForModal = categoryId;
    this.modalService.openModal();
  }

  showDrawer(cylinderId: string) {
    this.selectedCylinderId = cylinderId;
    this.drawerService.openDrawer();
  }

  openDaysModal(): void {
    this.updateExistingDays();
    this.modalService.openModal();
  }

  onItemDropped($event: CdkDragDrop<any[]>) {}

  getWeekDaysString(cylinder: Cylinder): string {
    let result: string[] = [];
    for (let i = 0; i < WeekDays.length; i++) {
      if (cylinder.days[i]) {
        result.push(WeekDays[i].name);
      }
    }
    return result.join('، ');
  }

  handleDrawerSubmit(event: { menuId: string; body: any }) {
    this.menuService.addCategoryToMenu(event.menuId, event.body).subscribe({
      next: (res) => {
        this.messageService.success(' دسته‌بندی با موفقیت اضافه شد');
        this.menuService.getMenuById(this.menuId);
      },
      error: (err) => {
        console.error(' خطا در ارسال دسته‌بندی', err);
        this.messageService.error(' خطا در ارسال دسته‌بندی');
      },
    });
  }

  updateExistingDays(): void {
    this.existingDays = [];
    this.cylinders.forEach((cylinder) => {
      if (cylinder.days) {
        for (let i = 0; i < WeekDays.length; i++) {
          if (
            cylinder.days[i] &&
            !this.existingDays.includes(WeekDays[i].value)
          ) {
            this.existingDays.push(WeekDays[i].value);
          }
        }
      }
    });
    console.log('Existing days:', this.existingDays);
  }
}
