import { Component } from '@angular/core';
import { AuthService } from '../../../main/services/auth/auth.service';
import { MenuService } from '../../services/menu/menu.service';
import { Menu } from '../../models/Menu';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-created-menus-page',
  standalone: false,
  templateUrl: './created-menus-page.component.html',
  styleUrl: './created-menus-page.component.scss',
})
export class CreatedMenusPageComponent {
  menus: Menu[] = [];
  visibleMenus: Menu[] = [];
  branchId: string | null = null;
  private subscriptions: Subscription = new Subscription();
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router
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
          this.filterMenus();
        },
        error: (error) => {
          console.error('خطا در دریافت منوها:', error);
          this.menus = [];
        },
      })
    );
    this.menuService.getAllMenusForBranches();
  }

  filterMenus() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.visibleMenus = [...this.menus];
    } else {
      this.visibleMenus = this.menus.filter(menu =>
        menu.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  viewMenuDetails(menuId: string) {
    this.router.navigate(['/dashboard/preview', menuId]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
