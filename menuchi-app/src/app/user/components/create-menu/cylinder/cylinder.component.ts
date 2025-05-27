import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MenuCategory } from '../../../models/Menu';
import { Item } from '../../../models/Item';

@Component({
  selector: 'app-cylinder',
  templateUrl: './cylinder.component.html',
  styleUrls: ['./cylinder.component.scss'],
  standalone: false,
})
export class CylinderComponent {
  @Input() weekDays!: string;
  @Input() panels: MenuCategory[] = [];
  @Input() menuId!: string;

  @Output() itemDropped = new EventEmitter<CdkDragDrop<Item[]>>();
  @Output() addItemWithCategory = new EventEmitter<string>();

  loading = false;
  itemChecked = false;

  constructor(private sanitizer: DomSanitizer) {}

  getSafeResourceUrl(url: string | undefined): SafeResourceUrl {
    if (url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  drop(event: CdkDragDrop<MenuCategory[]>) {
    moveItemInArray(this.panels, event.previousIndex, event.currentIndex);
  }

  drop2(event: CdkDragDrop<Item[]>) {
    this.itemDropped.emit(event);
  }

  openModalForCategory(categoryId: string) {
    this.addItemWithCategory.emit(categoryId);
  }
}
