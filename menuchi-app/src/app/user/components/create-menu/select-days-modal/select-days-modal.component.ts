import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalService } from '../../../services/modal/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CreateCylinder } from '../../../models/Menu';
import { MenuService } from '../../../services/menu/menu.service';

@Component({
  selector: 'app-select-days-modal',
  standalone: false,
  templateUrl: './select-days-modal.component.html',
  styleUrl: './select-days-modal.component.scss',
})
export class SelectDaysModalComponent implements OnInit, OnDestroy {
  @Input() menuId!: string;
  @Input() selectedDays: string[] = [];

  isOkLoading = false;
  isVisible = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();
  private destroy$ = new Subject<void>();
  weekDays = [
    { name: 'شنبه', value: 'sat', checked: false, disabled: false },
    { name: 'یکشنبه', value: 'sun', checked: false, disabled: false },
    { name: 'دوشنبه', value: 'mon', checked: false, disabled: false },
    { name: 'سه شنبه', value: 'tue', checked: false, disabled: false },
    { name: 'چهارشنبه', value: 'wed', checked: false, disabled: false },
    { name: 'پنج شنبه', value: 'thu', checked: false, disabled: false },
    { name: 'جمعه', value: 'fri', checked: false, disabled: false },
  ];

  constructor(
    private readonly modalService: ModalService,
    private readonly messageService: NzMessageService,
    private readonly menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.modalService.modalOpens$.subscribe({
      next: (modalState) => {
        this.isVisible = modalState.isOpen;
        if (modalState.isOpen) {
          this.resetDaysSelection();
        }
      },
      error: (error) =>
        console.error('Modal error in select days, line 30:', error),
    });
  }

  onAllChecked(value: boolean): void {
    this.weekDays.forEach((item) => {
      this.updateCheckedSet(item.value, value);
      item.checked = value;
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    const day = this.weekDays.find((d) => d.value === id);
    if (day) {
      this.updateCheckedSet(id, checked);
      day.checked = checked;
      this.refreshCheckedStatus();
    }
  }

  submit(): void {
    const request: CreateCylinder = {
      sat: this.setOfCheckedId.has('sat'),
      sun: this.setOfCheckedId.has('sun'),
      mon: this.setOfCheckedId.has('mon'),
      tue: this.setOfCheckedId.has('tue'),
      wed: this.setOfCheckedId.has('wed'),
      thu: this.setOfCheckedId.has('thu'),
      fri: this.setOfCheckedId.has('fri'),
    };

    const anyDaySelected = Object.values(request).some(Boolean);
    if (!anyDaySelected) {
      this.messageService.warning('لطفاً حداقل یک روز را انتخاب کنید.');
      return;
    }

    this.menuService.createMenuCylinder(this.menuId, request).subscribe({
      next: (response) => {
        this.messageService.success(' منوی جدید با موفقیت ایجاد شد!');
        this.menuService.getMenuById(this.menuId);
        this.modalService.closeModal();
      },
      error: (error) => {
        console.log('error in select days:', error);
        this.messageService.error(' ' + error.error.message);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.weekDays.every((item) =>
      this.setOfCheckedId.has(item.value),
    );
    this.indeterminate =
      this.weekDays.some((item) => this.setOfCheckedId.has(item.value)) &&
      !this.checked;
  }

  handleCancel(): void {
    this.modalService.closeModal();
    this.resetDaysSelection();
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.modalService.closeModal();
      this.isOkLoading = false;
      this.resetDaysSelection();
    }, 2000);
  }

  resetDaysSelection(): void {
    this.setOfCheckedId.clear();
    this.checked = false;
    this.indeterminate = false;
    this.weekDays.forEach((day) => {
      day.checked = false;
      day.disabled = false;
    });
  }
}
