import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  loading: boolean = false;

  @Input() list!: { id: string; items: { name: string }[] };
  @Input() connectedLists: string[] = [];
  @Output() itemDropped = new EventEmitter<CdkDragDrop<any[]>>();

  drop2(event: any) {
    this.itemDropped.emit(event);
  }
}
