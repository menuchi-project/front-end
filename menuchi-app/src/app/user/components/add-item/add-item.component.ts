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
import {
  CategoryName,
  CreateItemRequest,
  Item,
  UpdateItemRequest,
} from '../../models/Item';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-item',
  standalone: false,
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() categorySelected: string | null = null;
  editingItem: Item | null = null;
  isEditMode: boolean = false;

  isOkLoading = false;
  isVisible = false;

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();

  categories: CategoryName[] = [];

  validateForm = this.fb.group({
    itemName: this.fb.control('', Validators.required),
    category: this.fb.control('', Validators.required),
    price: this.fb.control<number | null>(null, Validators.required),
    ingredients: this.fb.control('', Validators.required),
    image: this.fb.control<string | null>(null),
  });

  constructor(
    private readonly modalService: ModalService,
    private readonly itemService: ItemService,
    private readonly messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.itemService.catNamesData$.subscribe({
      next: (response: CategoryName[]) => {
        this.categories = response;
        this.trySetCategoryFromInput();
      },
      error: (error) => {
        console.log('error in add item, line 63:', error);
      },
    });

    this.modalService.modalOpens$.subscribe({
      next: (modalState) => {
        this.isVisible = modalState.isOpen;
        if (modalState.isOpen) {
          this.resetForm();
          this.categorySelected = modalState.categoryId;
          this.editingItem = modalState.itemToEdit;
          this.isEditMode = !!modalState.itemToEdit;

          if (this.isEditMode && this.editingItem) {
            this.populateFormForEdit(this.editingItem);
          } else {
            this.trySetCategoryFromInput();
          }
          this.itemService.getBacklogCatNames();
        }
      },
      error: (error) =>
        console.error('Modal error in add item, line 64:', error),
    });

    this.itemService.geAllItems();
    this.itemService.getBacklogCatNames();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  handleOk(): void {
    this.submitForm();
    this.isOkLoading = true;
  }

  handleCancel(): void {
    this.modalService.closeModal();
    this.resetForm();
  }

  populateFormForEdit(item: Item): void {
    this.validateForm.patchValue({
      itemName: item.name,
      category: item.categoryId, // todo
      price: item.price,
      ingredients: item.ingredients,
      image: null, // todo
    });
    this.validateForm.get('category')?.disable();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isOkLoading = true;
      const formValues = this.validateForm.getRawValue();

      if (this.isEditMode && this.editingItem) {
        const updateRequest: UpdateItemRequest = {
          name: formValues.itemName!,
          categoryId: formValues.category!,
          ingredients: formValues.ingredients!,
          price: parseFloat(formValues.price!.toString()),
          picKey: formValues.image,
          subCategoryId: this.editingItem.subCategoryId,
        };

        this.itemService
          .updateItem(this.editingItem.id, updateRequest)
          .subscribe({
            next: () => {
              this.messageService.success(' آیتم با موفقیت ویرایش شد.');
              this.itemService.getCategoriesWithItems();
              this.modalService.closeModal();
              this.isOkLoading = false;
              this.resetForm();
            },
            error: (error) => {
              console.error('error in update item:', error);
              for (let e of error.error.details)
                this.messageService.error(' ' + e.message);
              this.isOkLoading = false;
            },
          });
      } else {
        let findCatName = this.categories.find(
          (c) => c.categoryId == formValues.category,
        )?.id!;

        let newItem: CreateItemRequest = {
          categoryNameId: findCatName,
          name: formValues.itemName!,
          ingredients: formValues.ingredients!,
          price: parseFloat(formValues.price!.toString()),
          picKey: null, //todo
        };

        this.itemService.createItem(newItem).subscribe({
          next: (response) => {
            this.messageService.success(' آیتم با موفقیت ایجاد شد.');
            this.itemService.getCategoriesWithItems();
            this.modalService.closeModal();
            this.itemService.geAllItems();
            this.isOkLoading = false;
            this.resetForm();
          },
          error: (error) => {
            console.error('error in add item:', error);
            for (let e of error.error.details)
              this.messageService.error(' ' + e.message);
            this.isOkLoading = false;
          },
        });
      }
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
    console.log(
      'Category selected for modal (after categories loaded):',
      this.categorySelected,
      this.categories.map((c) => {
        c.id;
        c.categoryId;
        c.name;
      }),
    );

    if (this.categorySelected && this.categories.length > 0) {
      const exists = this.categories.find(
        (cat) => cat.categoryId === this.categorySelected,
      );

      if (exists) {
        control?.setValue(this.categorySelected);
        control?.disable();
      } else {
        control?.enable();
        control?.reset();
      }
    } else {
      control?.enable();
      control?.reset();
    }
  }

  resetForm(): void {
    this.validateForm.reset();
    this.validateForm.enable();
    this.categorySelected = null;
    this.editingItem = null;
    this.isEditMode = false;
  }
}
