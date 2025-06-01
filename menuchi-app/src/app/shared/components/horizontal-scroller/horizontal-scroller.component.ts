import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CATEGORIES } from '../../../main/models/CatNameIcons';

@Component({
  selector: 'app-horizontal-scroller',
  templateUrl: './horizontal-scroller.component.html',
  styleUrls: ['./horizontal-scroller.component.scss'],
  standalone: false,
})
export class HorizontalScrollerComponent implements OnChanges, OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  @Input() items: any[] = [];
  @Output() categorySelected = new EventEmitter<string>();

  selectedItem: any;

  ngOnInit() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].icon = CATEGORIES.find(
        (c) => c.label == this.items[i].name,
      )?.icon;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && this.items.length > 0) {
      this.selectedItem = this.items[0];
      this.categorySelected.emit(this.selectedItem.categoryId);

      for (let i = 0; i < this.items.length; i++) {
        this.items[i].icon = CATEGORIES.find(
          (c) => c.label == this.items[i].name,
        )?.icon;

        if (!this.items[i].icon)
          this.items[i].icon = 'assets/icons/categories/سالاد.svg';
      }
    }
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  }

  selectItem(item: any) {
    this.selectedItem = item;
    this.categorySelected.emit(item.categoryId);
  }
}
