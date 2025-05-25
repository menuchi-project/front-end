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
import { CategoryService } from '../../services/category/category.service';

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
  backlogCategoryNames: CategoryName[] = [];
  defaultCategoryNames: CategoryName[] = [];

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
    private readonly categoryService: CategoryService,
    private readonly messageService: NzMessageService,
  ) {}

  isAddModal = () => !this.isEditMode && this.categorySelected == null;

  ngOnInit(): void {
    this.itemService.geAllItems();
    this.itemService.getBacklogCatNames();
    this.categoryService.getCategoryNames();

    this.itemService.catNamesData$.subscribe({
      next: (response: CategoryName[]) => {
        this.backlogCategoryNames = response;

        this.categoryService.getCategoryNamesData$.subscribe({
          next: (response: CategoryName[]) => {
            this.defaultCategoryNames = response;
          },
          error: (error) => {
            console.error('error in add item, line 63:', error);
          },
        });
      },
      error: (error) => {
        console.error('error in add item, line 63:', error);
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

          this.categoryService.getCategoryNames();
          this.categories = this.backlogCategoryNames;

          if (this.isAddModal()) {
            const diff = this.defaultCategoryNames.filter(
              (item) => !this.backlogCategoryNames.find((c) => c.id == item.id),
            );

            this.categories.push(...diff);
          }
          console.log(113, this.categories, this.categorySelected);

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
      category: item.categoryId,
      price: item.price,
      ingredients: item.ingredients,
      image: null, // todo
    });

    this.validateForm.get('category')?.setValue(item.categoryId);
    this.validateForm.get('category')?.disable();

    console.log(
      117,
      this.validateForm.get('category')?.getRawValue(),
      item.categoryId,
      this.categories,
    );
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
              this.itemService.getCategoriesWithItems().subscribe();
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
        let findCatNameId = this.categories.find(
          (c) => c.categoryId == formValues.category,
        )?.id!;

        if (!findCatNameId) findCatNameId = formValues.category;

        let newItem: CreateItemRequest = {
          categoryNameId: findCatNameId,
          name: formValues.itemName!,
          ingredients: formValues.ingredients!,
          price: parseFloat(formValues.price!.toString()),
          picKey: null, //todo
        };

        console.log(197, newItem);

        this.itemService.createItem(newItem).subscribe({
          next: (response) => {
            this.messageService.success(' آیتم با موفقیت ایجاد شد.');
            this.itemService.getCategoriesWithItems().subscribe();
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

    if (this.categorySelected && this.categories.length > 0) {
      const exists = this.categories.find(
        (cat) => cat.id === this.categorySelected,
      );

      if (exists) {
        control?.setValue(exists.categoryId);
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
