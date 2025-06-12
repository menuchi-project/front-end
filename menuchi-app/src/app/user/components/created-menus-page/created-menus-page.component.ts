import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { MenuService } from '../../services/menu/menu.service';
import { Menu } from '../../models/Menu';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PersianNumberPipe } from '../../../shared/pipes/persian-number/persian-number.pipe';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-created-menus-page',
  standalone: false,
  templateUrl: './created-menus-page.component.html',
  styleUrl: './created-menus-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CreatedMenusPageComponent implements OnDestroy {
  menus: Menu[] = [];
  visibleMenus: Menu[] = [];
  branchId: string | null = null;
  private subscriptions: Subscription = new Subscription();
  searchQuery: string = '';
  persianNumberPipe = new PersianNumberPipe();

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router,
    private modalService: NzModalService,
    private messageService: NzMessageService,
  ) {}

  ngOnInit() {
    this.branchId = this.authService.getBranchId();

    this.subscriptions.add(
      this.menuService.menusData$.subscribe({
        next: (menus: Menu[]) => {
          this.menus = menus
            .filter((menu) =>
              this.authService.getAllBranchIds().includes(menu.branchId),
            )
            .map((menu) => ({
              ...menu,
              name: menu.name || 'بدون نام',
            }));
          this.filterMenus();
        },
        error: (error) => {
          console.error('خطا در دریافت منوها:', error);
          this.menus = [];
        },
      }),
    );
    this.menuService.getAllMenusForBranches();
  }

  filterMenus() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.visibleMenus = [...this.menus];
    } else {
      this.visibleMenus = this.menus.filter((menu) =>
        menu.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    }
  }

  viewMenuDetails(menuId: string) {
    this.router.navigate(['/dashboard/preview', menuId]);
  }

  deleteMenu(menuId: string) {
    this.modalService.confirm({
      nzTitle: 'حذف منو',
      nzContent: 'آیا مطمئن هستید که می‌خواهید این منو را حذف کنید؟!',
      nzOkText: 'تأیید',
      nzOkType: 'primary',
      nzCancelText: 'لغو',
      nzNoAnimation: true,
      nzStyle: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'block',
      },
      nzOnOk: () => {
        this.menuService.deleteMenu(menuId).subscribe({
          next: () => {
            this.menus = this.menus.filter((menu) => menu.id !== menuId);
            this.filterMenus();
            this.messageService.success('منو با موفقیت حذف شد');
          },
          error: (error) => {
            if (error.status === 401) {
              this.messageService.error(
                'کاربر غیرمجاز است. لطفاً وارد حساب خود شوید.',
              );
            } else if (error.status === 403) {
              this.messageService.error(
                'دسترسی رد شد. شما مجاز به انجام این عملیات نیستید.',
              );
            } else {
              console.error('خطا در حذف منو:', error);
              this.messageService.error(
                'خطایی رخ داده است. لطفاً دوباره تلاش کنید.',
              );
            }
          },
        });
      },
      nzOnCancel: () => {
        this.messageService.info('عملیات حذف لغو شد');
      },
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
