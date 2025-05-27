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
          this.updateDisabledDays();
        }
      },
      error: (error) =>
        console.error('Modal error in select days, line 30:', error),
    });
  }

  onAllChecked(value: boolean): void {
    this.weekDays.forEach((item) => {
      if (!item.disabled) {
        this.updateCheckedSet(item.value, value);
        item.checked = value;
      }
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    const day = this.weekDays.find((d) => d.value === id);
    if (day && !day.disabled) {
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

  updateDisabledDays(): void {
    this.weekDays.forEach((day) => {
      if (this.selectedDays.includes(day.value)) {
        day.disabled = true;
        day.checked = true;
        this.setOfCheckedId.add(day.value);
      } else {
        day.disabled = false;
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
    const enabledWeekDays = this.weekDays.filter((item) => !item.disabled);
    this.checked = enabledWeekDays.every((item) =>
      this.setOfCheckedId.has(item.value),
    );
    this.indeterminate =
      enabledWeekDays.some((item) => this.setOfCheckedId.has(item.value)) &&
      !this.checked;
  }

  handleCancel(): void {
    this.modalService.closeModal();
    this.setOfCheckedId.clear();
    this.checked = false;
    this.indeterminate = false;
    this.weekDays.forEach((day) => {
      day.checked = false;
      day.disabled = false;
    });
  }

  handleOk(): void {
    this.isOkLoading = true;
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
