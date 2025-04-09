import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  loading: boolean = false;

  @Input() list: any;
  @Input() connectedLists: string[] = [];
  @Output() itemDropped = new EventEmitter<CdkDragDrop<any[]>>();

  constructor(private readonly modalService: ModalService) {}

  drop2(event: CdkDragDrop<any[]>) {
    this.itemDropped.emit(event);
  }

  showModal(): void {
    this.modalService.openModal();
  }
}
