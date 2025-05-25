import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from '../../models/Item';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalOpens = new Subject<{
    isOpen: boolean;
    categoryId: string | null;
    itemToEdit: Item | null;
  }>();
  modalOpens$ = this.modalOpens.asObservable();

  openModal(categoryId: string | null = null, itemToEdit: Item | null = null) {
    this.modalOpens.next({
      isOpen: true,
      categoryId: categoryId,
      itemToEdit: itemToEdit,
    });
  }

  closeModal() {
    this.modalOpens.next({ isOpen: false, categoryId: null, itemToEdit: null });
  }
}
