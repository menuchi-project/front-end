import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TitleService } from '../../../shared/services/title/title.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnDestroy {
  isCollapsed = true; // منو به طور پیش‌فرض بسته است
  isMobileView = false; // متغیر برای تشخیص حالت موبایل
  pageTitle = 'مدیریت';
  onPageChangedSub: Subscription;
  showHeader = true;

  constructor(
    private readonly titleService: TitleService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
  ) {
    this.checkScreenWidth(); // بررسی عرض صفحه در زمان بارگذاری اولیه

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !(this.router.url === '/dashboard');
        // بستن خودکار منو پس از ناوبری در حالت موبایل
        if (this.isMobileView) {
          this.isCollapsed = true;
        }
        this.cdr.detectChanges();
      }
    });

    this.onPageChangedSub = this.titleService.onPageChanged$.subscribe(
      ($event: string) => {
        this.updateTitle($event);
      },
    );
  }

  // با تغییر سایز پنجره، وضعیت موبایل را چک می‌کنیم
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  private checkScreenWidth(): void {
    this.isMobileView = window.innerWidth < 768;
    // در حالت دسکتاپ منو باز و در موبایل بسته باشد
    this.isCollapsed = this.isMobileView;
  }

  // این متد باعث می‌شود با کلیک روی هر آیتم منو، در حالت موبایل منو بسته شود
  onMenuItemClick(): void {
    if (this.isMobileView) {
      this.isCollapsed = true;
    }
  }

  updateTitle(newTitle: string): void {
    this.pageTitle = newTitle;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.onPageChangedSub) {
      this.onPageChangedSub.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.messageService.success(' با موفقیت خارج شدید.');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.messageService.error(' مشکلی در خروج از حساب کاربری پیش آمد.');
      },
    });
  }

  handleCreateNewMenu() {
    localStorage.removeItem('currentCreatingMenuId');
    this.router.navigateByUrl('/dashboard/menu');
  }
}
