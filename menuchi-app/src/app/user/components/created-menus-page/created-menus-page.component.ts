import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { MenuService } from '../../services/menu/menu.service';
import { Menu } from '../../models/Menu';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../../api-config/environment'; // Import environment for API URL
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-created-menus-page',
  standalone: false, // Set to true if it's meant to be standalone
  templateUrl: './created-menus-page.component.html',
  styleUrl: './created-menus-page.component.scss',
})
export class CreatedMenusPageComponent implements OnInit, OnDestroy {
  menus: Menu[] = [];
  visibleMenus: Menu[] = [];
  branchId: string | null = null;
  private subscriptions: Subscription = new Subscription();
  searchQuery: string = '';

  // Properties for QR Code Modal
  isQrModalVisible = false;
  publicMenuUrl: string | null = null;
  currentMenuName: string | null = null;

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private http: HttpClient, // Inject HttpClient
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

  editMenu(menuId: string) {
    localStorage.setItem('currentCreatingMenuId', menuId);
    this.router.navigate(['/dashboard/menu']);
  }

  publishAndGetQr(menuId: string, menuName: string) {
    this.currentMenuName = menuName;
    // Construct the public URL for the menu view endpoint
    this.publicMenuUrl = `${environment.API_URL}/menus/${menuId}/view`;

    // You might want to make an actual API call here if publishing is a separate action
    // For now, we're just constructing the public URL directly.
    // If 'publishing' means making the menu available, that logic should be handled by your backend
    // and potentially a separate API call before generating the QR code.

    this.isQrModalVisible = true;
  }

  handleQrModalCancel(): void {
    this.isQrModalVisible = false;
    this.publicMenuUrl = null;
    this.currentMenuName = null;
  }

  downloadQrCode(): void {
    const qrcodeElement = document.getElementById('qrcode');
    if (qrcodeElement) {
      const canvas = qrcodeElement.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${this.currentMenuName || 'menu'}-qr-code.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        this.messageService.error('خطا در یافتن QR کد برای دانلود.');
      }
    } else {
      this.messageService.error('عنصر QR کد پیدا نشد.');
    }
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
