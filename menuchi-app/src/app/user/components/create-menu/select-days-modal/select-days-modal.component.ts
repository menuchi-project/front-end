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

  isOkLoading = false;
  isVisible = false;
  // selectAll = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();
  private destroy$ = new Subject<void>();
  weekDays = [
    { name: 'شنبه', value: 'sat', checked: false },
    { name: 'یکشنبه', value: 'sun', checked: false },
    { name: 'دوشنبه', value: 'mon', checked: false },
    { name: 'سه شنبه', value: 'tue', checked: false },
    { name: 'چهارشنبه', value: 'wed', checked: false },
    { name: 'پنج شنبه', value: 'thu', checked: false },
    { name: 'جمعه', value: 'fri', checked: false },
  ];

  // todo
  onAllChecked(value: boolean): void {
    this.weekDays.forEach((item) => this.updateCheckedSet(item.value, value));
    this.refreshCheckedStatus();
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

    this.menuService.createMenuCylinder('', request);
  }

  constructor(
    private readonly modalService: ModalService,
    private readonly messageService: NzMessageService,
    private readonly menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.modalService.modalOpens$.subscribe({
      next: (isOpen) => {
        this.isVisible = isOpen;
      },
      error: (error) =>
        console.error('Modal error in select days, line 30:', error),
    });
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

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
}
