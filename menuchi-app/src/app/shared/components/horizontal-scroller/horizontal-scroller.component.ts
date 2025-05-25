import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-horizontal-scroller',
  templateUrl: './horizontal-scroller.component.html',
  styleUrls: ['./horizontal-scroller.component.scss'],
  standalone: false,
})
export class HorizontalScrollerComponent implements OnChanges {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  @Input() items: any[] = [];

  selectedItem: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && this.items.length > 0) {
      this.selectedItem = this.items[0];
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
  }
}
