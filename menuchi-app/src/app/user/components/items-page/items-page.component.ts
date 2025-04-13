import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-items-page',
  standalone: false,
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.scss',
})
export class ItemsPageComponent implements OnInit {
  constructor(
    private readonly titleService: TitleService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.titleService.onPageChanged$.next('آیتم‌های غذایی');
  }

  showModal(): void {
    this.modalService.openModal();
  }
}
