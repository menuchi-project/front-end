import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalOpens = new Subject<boolean>();
  modalOpens$ = this.modalOpens.asObservable();

  openModal() {
    this.modalOpens.next(true);
  }

  closeModal() {
    this.modalOpens.next(false);
  }
}
