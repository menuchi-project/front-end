import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ItemService } from '../../services/item/item.service';
import { CategoryName, CreateItemRequest } from '../../models/Item';
import { CategoryService } from '../../services/category/category.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-item',
  standalone: false,
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent implements OnInit, OnDestroy {
  isOkLoading = false;
  isVisible = false;

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();

  categories: CategoryName[] = [];

  validateForm = this.fb.group({
    itemName: this.fb.control('', Validators.required),
    category: this.fb.control('', Validators.required),
    price: this.fb.control('', Validators.required),
    ingredients: this.fb.control('', Validators.required),
    image: this.fb.control(null, Validators.required),
  });

  constructor(
    private readonly modalService: ModalService,
    private readonly itemService: ItemService,
    private readonly categoryService: CategoryService,
    private readonly messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategoryNamesData$.subscribe({
      next: (response: CategoryName[]) => {
        this.categories = response;
      },
      error: (error) => {
        console.log('error in add item, line 46:', error);
      },
    });

    this.modalService.modalOpens$.subscribe({
      next: (isOpen) => (this.isVisible = isOpen),
      error: (error) =>
        console.error('Modal error in add item, line 53:', error),
    });

    this.categoryService.getCategoryNames();
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

  submitForm(): void {
    if (this.validateForm.valid) {
      let newItem: CreateItemRequest = {
        categoryNameId: this.validateForm.value['category']!,
        name: this.validateForm.value['itemName']!,
        ingredients: this.validateForm.value['ingredients']!,
        price: parseFloat(this.validateForm.value['price']!),
        picKey: this.validateForm.value['image']!,
      };

      this.itemService.createItem(newItem).subscribe({
        next: (response) => {
          this.messageService.success(' آیتم با موفقیت ایجاد شد.');
          this.itemService.getCategoriesWithItems();
          this.modalService.closeModal();
        },
        error: (error) => {
          console.log('error in add item, line 93:', error);
          for (let e of error.error.details)
            this.messageService.error(' ' + e.message);
        },
      });
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
