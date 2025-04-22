import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DrawerService } from '../../services/drawer/drawer.service';
import { MenuService } from '../../services/menu/menu.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Cylinder, Menu, WeekDays } from '../../models/Menu';

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
    this.authService.fetchUserProfile();

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

  openModalForCategory(categoryId: string): void {
    this.selectedCategoryForModal = categoryId;
    this.modalService.openModal();
  }

  showDrawer(cylinderId: string) {
    this.selectedCylinderId = cylinderId;
    this.drawerService.openDrawer();
  }

  openDaysModal(): void {
    this.modalService.openModal();
  }

  onItemDropped($event: CdkDragDrop<any[]>) {}

  getWeekDaysString(cylinder: Cylinder): string {
    let result = '';

    for (let i = 0; i < 7; i++)
      if (cylinder.days[i]) result += WeekDays[i].name + '، ';

    console.log(result, '11');
    return result.substring(0, result.length - 2);
  }

  handleDrawerSubmit(event: { menuId: string; body: any }) {
    this.menuService.addCategoryToMenu(event.menuId, event.body).subscribe({
      next: (res) => {
        console.log(' دسته‌بندی با موفقیت اضافه شد', res);
        this.messageService.success(' دسته‌بندی با موفقیت اضافه شد');
        this.menuService.getMenuById(this.menuId);
      },
      error: (err) => {
        console.error(' خطا در ارسال دسته‌بندی', err);
        this.messageService.error(' خطا در ارسال دسته‌بندی');
      },
    });
  }
}
