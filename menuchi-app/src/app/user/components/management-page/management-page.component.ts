import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TitleService } from '../../../shared/services/title/title.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management-page',
  standalone: false,
  templateUrl: './management-page.component.html',
  styleUrl: './management-page.component.scss',
})
export class ManagementPageComponent implements OnDestroy {
  isCollapsed = false;
  pageTitle = 'مدیریت';
  onPageChangedSub: Subscription;

  constructor(
    private readonly titleService: TitleService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
  ) {
    this.onPageChangedSub = this.titleService.onPageChanged$.subscribe(
      ($event: string) => {
        this.updateTitle($event);
      },
    );
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
}
