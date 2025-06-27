import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigationEnd, Router } from '@angular/router';
import { TitleService } from '../../../shared/services/title/title.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import { ItemService } from '../../services/item/item.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnDestroy, OnInit {
  isCollapsed = true;
  isMobileView = false;
  pageTitle = 'مدیریت';
  onPageChangedSub: Subscription;
  showHeader = true;

  constructor(
    private readonly titleService: TitleService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
    private readonly itemService: ItemService,
  ) {
    this.checkScreenWidth();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !(this.router.url === '/dashboard');
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

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user && this.authService.getBacklogId()) {
        // this.itemService.initialize();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  private checkScreenWidth(): void {
    this.isMobileView = window.innerWidth < 768;
    if (!this.isMobileView) {
      this.isCollapsed = false;
    } else {
      this.isCollapsed = true;
    }
  }

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
