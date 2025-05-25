import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
export class AddItemComponent implements OnInit, OnDestroy, OnChanges {
  // Input را برای حالت "افزودن کلی" نگه می‌داریم، اما priority با categoryId از سرویس است.
  @Input() categorySelected: string | null = null;

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
    image: this.fb.control(null),
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
        this.trySetCategoryFromInput();
      },
      error: (error) => {
        console.log('error in add item, line 56:', error);
      },
    });

    this.modalService.modalOpens$.subscribe({
      next: (modalState) => {
        this.isVisible = modalState.isOpen;
        if (modalState.isOpen) {
          this.resetForm();
          this.categorySelected = modalState.categoryId;
          this.trySetCategoryFromInput();
          this.categoryService.getCategoryNames();
        }
      },
      error: (error) =>
        console.error('Modal error in add item, line 64:', error),
    });

    this.itemService.geAllItems();
    this.categoryService.getCategoryNames();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // این بخش هنوز می‌تواند برای تنظیم اولیه استفاده شود، اما مقدار سرویس ارجحیت دارد
    if (changes['categorySelected'] && !this.isVisible) {
      // فقط وقتی مودال باز نیست تغییرات Input را اعمال کن
      this.trySetCategoryFromInput();
    }
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.modalService.closeModal();
      this.isOkLoading = false;
      this.resetForm();
    }, 2000);
  }

  handleCancel(): void {
    this.modalService.closeModal();
    this.resetForm();
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
          this.itemService.geAllItems();
          this.resetForm();
        },
        error: (error) => {
          console.log('error in add item, line 110:', error);
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
      this.messageService.error(' لطفاً فرم را به درستی پر کنید!');
    }
  }

  private trySetCategoryFromInput(): void {
    const control = this.validateForm.get('category');
    console.log('Category selected for modal:', this.categorySelected);

    if (this.categorySelected && this.categories.length > 0) {
      const exists = this.categories.find(
        (cat) => cat.id === this.categorySelected,
      );

      if (exists) {
        control?.setValue(this.categorySelected);
        control?.disable(); // غیر فعال کردن فیلد
      }
    } else {
      control?.enable();
      control?.reset();
    }
  }

  resetForm(): void {
    this.validateForm.reset();
    this.validateForm.enable();
    this.categorySelected = null; // برای اطمینان از پاک شدن در هنگام بسته شدن
  }
}
