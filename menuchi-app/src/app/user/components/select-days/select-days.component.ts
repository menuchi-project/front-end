import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-select-days',
  standalone: false,
  templateUrl: './select-days.component.html',
  styleUrl: './select-days.component.scss',
})
export class SelectDaysComponent implements OnInit, OnDestroy {
  isOkLoading = false;
  isVisible = false;

  private destroy$ = new Subject<void>();

  constructor(private readonly modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalOpens$.subscribe({
      next: (isOpen) => (this.isVisible = isOpen),
      error: (error) => console.error('Modal error in select days:', error),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.modalService.closeModal();
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.modalService.closeModal();
  }
}
