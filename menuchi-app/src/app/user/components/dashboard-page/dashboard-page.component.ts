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
  pageTitle = 'مدیریت';
  onPageChangedSub: Subscription;
  showHeader = true;
  isCollapsed = window.innerWidth < 768;

  constructor(
    private readonly titleService: TitleService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !(this.router.url === '/dashboard');
        this.cdr.detectChanges();
      }
    });

    this.onPageChangedSub = this.titleService.onPageChanged$.subscribe(
      ($event: string) => {
        this.updateTitle($event);
      },
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 768) {
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
    this.router.navigateByUrl('/dashboard').then(() => {
      this.router.navigateByUrl('/dashboard/menu');
    });
  }
}
