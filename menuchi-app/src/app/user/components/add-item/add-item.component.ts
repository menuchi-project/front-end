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

  // --
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  selectedValue: any;

  validateForm = this.fb.group({
    password: this.fb.control('', [Validators.required]),
    nickname: this.fb.control('', [Validators.required]),
    category: this.fb.control('', [Validators.required]),
    phoneNumber: this.fb.control('', [Validators.required]),
    comment: this.fb.control('', [Validators.required]),
    itemImg: this.fb.control('', [Validators.required]),
  });
  cats: string[] = [
    'سلام2',
    'سلام3',
    'سلام4',
    'سلا5م',
    'س6لام',
    '7سلام',
    'سلام8',
    'سلا9م',
    'س0لام',
    'سل11ام',
    'س12لام',
    'س121لام',
    'س14لام',
    '15سلام',
    'سل16ام',
    'سل17ام',
  ];

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
