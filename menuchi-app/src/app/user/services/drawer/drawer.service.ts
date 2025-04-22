import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private drawerOpens = new Subject<boolean>();
  drawerOpens$ = this.drawerOpens.asObservable();

  openDrawer() {
    this.drawerOpens.next(true);
  }

  closeDrawer() {
    this.drawerOpens.next(false);
  }
}
