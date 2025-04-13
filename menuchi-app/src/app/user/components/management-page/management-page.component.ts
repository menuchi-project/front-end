import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TitleService } from '../../../shared/services/title/title.service';

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

  constructor(private titleService: TitleService) {
    this.onPageChangedSub = this.titleService.onPageChanged$.subscribe(
      ($event: string) => {
        this.updateTitle($event);
      },
    );
  }

  updateTitle(newTitle: string): void {
    this.pageTitle = newTitle;
  }

  ngOnDestroy(): void {
    if (this.onPageChangedSub) {
      this.onPageChangedSub.unsubscribe();
    }
  }
}
