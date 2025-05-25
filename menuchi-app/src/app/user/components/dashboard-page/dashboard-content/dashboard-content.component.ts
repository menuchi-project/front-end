import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from '../../../models/Item';
import { Menu } from '../../../models/Menu';
import { ItemService } from '../../../services/item/item.service';
import { UserService } from '../../../services/user/user.service';
import { MenuService } from '../../../services/menu/menu.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../main/services/auth/auth.service';
import { RestaurantService } from '../../../services/restaurant/restaurant.service';

@Component({
  selector: 'app-dashboard-content',
  standalone: false,
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
})
export class DashboardContentComponent implements OnInit, OnDestroy {
[x: string]: any;
  item!: Item;
  menus: Menu[] = [];
  userName: string = '';
  visibleMenus: Menu[] = [];
  currentIndex = 0;
  private itemsSubscription!: Subscription;
  private menusSubscription!: Subscription;
  private branchId: string | null;
  branches: any[] = [];
  restaurantName: string = '';
  restaurantImageUrl: string = '';
  private restaurantId: string | null;

  constructor(
    private readonly itemService: ItemService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly menuService: MenuService,
    private readonly restaurantService: RestaurantService
  ) {
    this.branchId = this.authService.getBranchId();
    this.restaurantId = this.authService.getRestaurantId();
  }

  ngOnInit() {
  this.userName = this.userService.getUserName();

  this.authService.user$.subscribe(user => {
    if (user) {
      this.branchId = this.authService.getBranchId();

      this.menusSubscription = this.menuService.menusData$.subscribe({
        next: (menus: Menu[]) => {
          this.menus = menus.map(menu => ({
            ...menu,
            name: menu.name || 'بدون عنوان'
          }));
          this.updateVisibleMenus();
        },
        error: (error) => {
          console.log('Error fetching menus:', error);
        }
      });

      this.menuService.getAllMenusForBranches();
    }
  });

  this.itemsSubscription = this.itemService.itemsData$.subscribe({
    next: (response: Item[]) => {
      this.item = response[0] || null;
    },
    error: (error) => {
      console.log('Error fetching items:', error);
    },
  });

  this.itemService.geAllItems();

  if (this.restaurantId) {
      this.restaurantService.getRestaurantDetails(this.restaurantId).subscribe({
        next: (restaurant) => {
          this.restaurantName = restaurant.displayName;
          this.restaurantImageUrl = restaurant.avatarUrl;
          this.branches = restaurant.branches;
        },
        error: (err) => console.error('خطا در دریافت اطلاعات رستوران:', err)
      });
    }
}


  updateVisibleMenus() {
    this.visibleMenus = this.menus.slice(this.currentIndex, this.currentIndex + 2);
  }

  scrollMenus(direction: 'left' | 'right') {
    if (direction === 'left' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'right' && this.currentIndex + 2 < this.menus.length) {
      this.currentIndex++;
    }
    this.updateVisibleMenus();
  }


  viewMenuDetails(menuId: string) {
    console.log('Viewing menu details:', menuId);
  }

  onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = '/assets/images/Default-Restaurant.svg';
}

  ngOnDestroy() {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
    if (this.menusSubscription) {
      this.menusSubscription.unsubscribe();
    }
  }
}
