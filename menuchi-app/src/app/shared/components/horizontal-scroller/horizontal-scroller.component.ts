import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-horizontal-scroller',
  templateUrl: './horizontal-scroller.component.html',
  styleUrls: ['./horizontal-scroller.component.scss'],
  standalone: false,
})
export class HorizontalScrollerComponent {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  menuItems = [
    { label: 'پیتزا', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'پیتزا', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'پیتزا', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'پیتزا', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'کباب', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'پیتزا', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'نوشیدنی', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'نوشیدنی', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'نوشیدنی', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'نوشیدنی', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'نوشیدنی', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'نوشیدنی', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'نوشیدنی', icon: 'assets/icons/categories/Pizza.svg' },
    { label: 'نوشیدنی', icon: 'assets/icons/categories/Pizza.svg' },
  ];

  selectedItem = this.menuItems[0];

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -150,
      behavior: 'smooth',
    });
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 150,
      behavior: 'smooth',
    });
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }
}
