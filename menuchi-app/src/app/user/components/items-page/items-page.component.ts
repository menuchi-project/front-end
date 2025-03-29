import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../shared/services/title/title.service';

@Component({
  selector: 'app-items-page',
  standalone: false,
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.scss',
})
export class ItemsPageComponent implements OnInit {
  constructor(private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.onPageChanged$.next('آیتم‌های غذایی');
  }
}
