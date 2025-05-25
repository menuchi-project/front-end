import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalOpens = new Subject<{
    isOpen: boolean;
    categoryId: string | null;
  }>();
  modalOpens$ = this.modalOpens.asObservable();

  openModal(categoryId: string | null = null) {
    this.modalOpens.next({ isOpen: true, categoryId: categoryId });
  }

  closeModal() {
    this.modalOpens.next({ isOpen: false, categoryId: null });
  }
}
