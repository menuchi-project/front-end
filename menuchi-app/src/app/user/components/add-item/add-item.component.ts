import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-add-item',
  standalone: false,
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent implements OnInit {
  isOkLoading = false;
  isVisible!: boolean;

  constructor(private readonly modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalOpens$.subscribe({
      next: (isOpen: boolean) => {
        console.log('add item comp: line 19', isOpen);
        this.isVisible = isOpen;
      },
      error: (error) => {
        console.log('error in add item comp: line 23', error);
      },
    });
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
