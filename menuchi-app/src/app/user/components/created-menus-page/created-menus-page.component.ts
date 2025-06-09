import { Component } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { MenuService } from '../../services/menu/menu.service';
import { Menu } from '../../models/Menu';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-created-menus-page',
  standalone: false,
  templateUrl: './created-menus-page.component.html',
  styleUrl: './created-menus-page.component.scss'
})
export class CreatedMenusPageComponent {
  menus: Menu[] = [];
  branchId: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private menuService: MenuService
  ) {}

   ngOnInit() {
   this.branchId = this.authService.getBranchId(); 

    this.subscriptions.add(
      this.menuService.menusData$.subscribe({
        next: (menus: Menu[]) => {
          this.menus = menus.filter(menu => 
            this.authService.getAllBranchIds().includes(menu.branchId)
          ).map(menu => ({
            ...menu,
            name: menu.name || 'بدون نام',
          }));
        },
        error: (error) => {
          console.error('خطا در دریافت منوها:', error);
          this.menus = [];
        },
      })
    );
    this.menuService.getAllMenusForBranches();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
