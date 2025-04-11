import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-item',
  standalone: false,
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent implements OnInit, OnDestroy {
  isOkLoading = false;
  isVisible!: boolean;
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();

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

  validateForm = this.fb.group({
    nickname: this.fb.control('', Validators.required),
    category: this.fb.control('', Validators.required),
    phoneNumber: this.fb.control('', Validators.required),
    comment: this.fb.control('', Validators.required),
    itemImg: this.fb.control(null, Validators.required),
    price: this.fb.control('', Validators.required),
  });

  cats: string[] = ['سلام2', 'سلام3'];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
