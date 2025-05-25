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
  @Input() selectedDays: string[] = []; // اضافه کردن این ورودی برای دریافت روزهای قبلی

  isOkLoading = false;
  isVisible = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();
  private destroy$ = new Subject<void>();
  weekDays = [
    { name: 'شنبه', value: 'sat', checked: false, disabled: false }, // اضافه کردن disabled
    { name: 'یکشنبه', value: 'sun', checked: false, disabled: false }, // اضافه کردن disabled
    { name: 'دوشنبه', value: 'mon', checked: false, disabled: false }, // اضافه کردن disabled
    { name: 'سه شنبه', value: 'tue', checked: false, disabled: false }, // اضافه کردن disabled
    { name: 'چهارشنبه', value: 'wed', checked: false, disabled: false }, // اضافه کردن disabled
    { name: 'پنج شنبه', value: 'thu', checked: false, disabled: false }, // اضافه کردن disabled
    { name: 'جمعه', value: 'fri', checked: false, disabled: false }, // اضافه کردن disabled
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
          this.updateDisabledDays(); // فراخوانی متد برای غیرفعال کردن روزها
        }
      },
      error: (error) =>
        console.error('Modal error in select days, line 30:', error),
    });
  }

  onAllChecked(value: boolean): void {
    this.weekDays.forEach((item) => {
      if (!item.disabled) {
        // فقط روزهای فعال را تغییر وضعیت دهید
        this.updateCheckedSet(item.value, value);
        item.checked = value;
      }
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    const day = this.weekDays.find((d) => d.value === id);
    if (day && !day.disabled) {
      // فقط روزهای فعال را تغییر وضعیت دهید
      this.updateCheckedSet(id, checked);
      day.checked = checked;
      this.refreshCheckedStatus();
    }
  }

  submit(): void {
    const request: CreateCylinder = {
      sat: this.weekDays[0].checked,
      sun: this.weekDays[1].checked,
      mon: this.weekDays[2].checked,
      tue: this.weekDays[3].checked,
      wed: this.weekDays[4].checked,
      thu: this.weekDays[5].checked,
      fri: this.weekDays[6].checked,
    };

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

  // متد جدید برای غیرفعال کردن روزها
  updateDisabledDays(): void {
    this.weekDays.forEach((day) => {
      if (this.selectedDays.includes(day.value)) {
        day.disabled = true;
        day.checked = true; // اگر روزی غیرفعال است، به صورت پیش‌فرض انتخاب شده باشد
        this.setOfCheckedId.add(day.value); // اضافه کردن روزهای غیرفعال به setOfCheckedId
      } else {
        day.disabled = false;
        // ریست کردن وضعیت چک شده اگر روز قبلا غیرفعال بوده و الان فعال شده
        if (this.setOfCheckedId.has(day.value)) {
          this.setOfCheckedId.delete(day.value);
          day.checked = false;
        }
      }
    });
    this.refreshCheckedStatus();
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
    const enabledWeekDays = this.weekDays.filter((item) => !item.disabled); // فقط روزهای فعال را در نظر بگیرید
    this.checked = enabledWeekDays.every((item) =>
      this.setOfCheckedId.has(item.value),
    );
    this.indeterminate =
      enabledWeekDays.some((item) => this.setOfCheckedId.has(item.value)) && // فقط روزهای فعال را در نظر بگیرید
      !this.checked;
  }

  handleCancel(): void {
    this.modalService.closeModal();
    this.setOfCheckedId.clear();
    this.checked = false;
    this.indeterminate = false;
    this.weekDays.forEach((day) => {
      day.checked = false;
      day.disabled = false; // اطمینان از ریست شدن وضعیت disabled
    });
  }

  handleOk(): void {
    this.isOkLoading = true;
    // این تابع در حال حاضر Submit را صدا نمی‌زند.
    // اگر می‌خواهید با Ok هم Submit شود، منطق submit() را اینجا بیاورید.
    setTimeout(() => {
      this.modalService.closeModal();
      this.isOkLoading = false;
      this.setOfCheckedId.clear();
      this.checked = false;
      this.indeterminate = false;
      this.weekDays.forEach((day) => {
        day.checked = false;
        day.disabled = false;
      });
    }, 2000);
  }

  get isAllWeekDaysDisabled(): boolean {
    return this.weekDays.every((day) => day.disabled);
  }
}
