import {
  Component,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Item } from '../../../models/Item';
import { Menu } from '../../../models/Menu';
import { ItemService } from '../../../services/item/item.service';
import { UserService } from '../../../services/user/user.service';
import { MenuService } from '../../../services/menu/menu.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../main/services/auth/auth.service';
import { RestaurantService } from '../../../services/restaurant/restaurant.service';
import { Branch, OpeningTimes, Restaurant } from '../../../models/restaurant';
import { Router } from '@angular/router';
import { PersianNumberPipe } from '../../../../shared/pipes/persian-number/persian-number.pipe';

export
@Pipe({
  name: 'joinNonEmpty',
  standalone: false,
})
class JoinNonEmptyPipe implements PipeTransform {
  transform(
    values: (string | null | undefined)[],
    separator: string = ', ',
  ): string {
    return values
      .filter((value) => value != null && value.trim() !== '')
      .join(separator);
  }
}

@Component({
  selector: 'app-dashboard-content',
  standalone: false,
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
  providers: [PersianNumberPipe],
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  [x: string]: any;

  item!: Item;
  menus: Menu[] = [];
  userName: string = '';
  visibleMenus: Menu[] = [];
  currentIndex = 0;
  private branchId: string | null;
  private restaurantId: string | null;
  restaurant: Restaurant = {
    id: '',
    name: 'بدون نام',
    imageUrl: '/assets/images/Default-Restaurant.svg',
    branches: [],
    openingHours: 'نامشخص',
    openingHoursTooltip: 'شناسه رستوران در دسترس نیست',
  };
  private subscriptions: Subscription = new Subscription();
  private itemsSubscription!: Subscription;
  private menusSubscription!: Subscription;

  constructor(
    private readonly itemService: ItemService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly menuService: MenuService,
    private readonly restaurantService: RestaurantService,
    private readonly router: Router,
    private readonly persianNumberPipe: PersianNumberPipe,
  ) {
    this.branchId = this.authService.getBranchId();
    this.restaurantId = this.authService.getRestaurantId();
  }

  ngOnInit() {
    this.userName = this.userService.getUserName();

    this.subscriptions.add(
      this.authService.user$.subscribe((user) => {
        if (user) {
          this.branchId = this.authService.getBranchId();

          this.menusSubscription = this.menuService.menusData$.subscribe({
            next: (menus: Menu[]) => {
              this.menus = menus.map((menu) => ({
                ...menu,
                name: menu.name || 'بدون نام',
              }));
              this.updateVisibleMenus();
            },
            error: (error) => {
              console.error('خطا در دریافت منوها:', error);
              this.menus = [];
              this.updateVisibleMenus();
            },
          });

          this.menuService.getAllMenusForBranches();
        }
      }),
    );

    this.itemsSubscription = this.itemService.itemsData$.subscribe({
      next: (response: Item[]) => {
        this.item = response[0] || null;
      },
      error: (error) => {
        console.error('خطا در دریافت آیتم‌ها: ', error);
      },
    });

    this.itemService.geAllItems();

    if (this.restaurantId) {
      this.subscriptions.add(
        this.restaurantService
          .getRestaurantDetails(this.restaurantId)
          .subscribe({
            next: (restaurantData: any) => {
              this.restaurant = {
                id: this.restaurantId || '',
                name:
                  restaurantData.displayName ||
                  restaurantData.name ||
                  'بدون نام',
                imageUrl:
                  restaurantData.avatarUrl ||
                  '/assets/images/Default-Restaurant.svg',
                branches: restaurantData.branches || [],
                openingHours: 'نامشخص',
                openingHoursTooltip: 'داده‌های ساعت کاری در دسترس نیست',
              };

              if (this.branchId) {
                const branch = this.restaurant.branches.find(
                  (b: Branch) => b.id === this.branchId,
                );
                console.log('Selected Branch:', branch); // لاگ دیباگ
                if (branch) console.log('Opening Times:', branch.openingTimes); // لاگ دیباگ
                if (branch && branch.openingTimes) {
                  this.restaurant.openingHours = this.formatOpeningHours(
                    branch.openingTimes,
                  );
                  this.restaurant.openingHoursTooltip =
                    this.formatOpeningHoursTooltip(branch.openingTimes);
                } else {
                  this.restaurant.openingHours = 'نامشخص';
                  this.restaurant.openingHoursTooltip =
                    'داده‌های ساعت کاری در دسترس نیست';
                }
              } else {
                this.restaurant.openingHours = 'نامشخص';
                this.restaurant.openingHoursTooltip =
                  'شناسه شعبه در دسترس نیست';
              }
            },
            error: (err) => {
              console.error('خطا در دریافت اطلاعات رستوران:', err);
              this.restaurant = {
                id: this.restaurantId || '',
                name: 'بدون نام',
                imageUrl: '/assets/images/Default-Restaurant.svg',
                branches: [],
                openingHours: 'نامشخص',
                openingHoursTooltip: 'اطلاعات ساعت کاری در دسترس نیست',
              };
            },
          }),
      );
    }
  }

  updateVisibleMenus() {
    this.visibleMenus = this.menus.slice(
      this.currentIndex,
      this.currentIndex + 2,
    );
  }

  scrollMenus(direction: 'left' | 'right') {
    if (direction === 'left' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (
      direction === 'right' &&
      this.currentIndex + 2 < this.menus.length
    ) {
      this.currentIndex++;
    }
    this.updateVisibleMenus();
  }

  viewMenuDetails(menuId: string) {
    this.router.navigate(['/dashboard/preview', menuId]);
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

  private formatOpeningHours(openingTimes: OpeningTimes): string {
    const timeRange = openingTimes.sat;
    if (!timeRange) {
      return 'نامشخص';
    }
    const [start, end] = timeRange.split('-');
    const startHour = parseInt(start.split(':')[0], 10);
    const endHour = parseInt(end.split(':')[0], 10);
    return `همه روزه - از ساعت ${this.persianNumberPipe.transform(startHour)} تا ${this.persianNumberPipe.transform(endHour)}`;
  }

  private formatOpeningHoursTooltip(openingTimes: OpeningTimes): string {
    const dayNames = [
      'شنبه',
      'یک‌شنبه',
      'دوشنبه',
      'سه‌شنبه',
      'چهارشنبه',
      'پنج‌شنبه',
      'جمعه',
    ];
    const days = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'] as const;

    const groups: { timeRange: string; dayIndices: number[] }[] = [];

    days.forEach((day, index) => {
      const timeRange = openingTimes[day] || 'closed';
      const existingGroup = groups.find((g) => g.timeRange === timeRange);
      if (existingGroup) {
        existingGroup.dayIndices.push(index);
      } else {
        groups.push({ timeRange, dayIndices: [index] });
      }
    });

    const hoursList = groups.map((group) => {
      const indices = group.dayIndices.sort((a, b) => a - b);
      let hours = 'تعطیل';

      if (group.timeRange !== 'closed') {
        const [start, end] = group.timeRange.split('-');
        const startHour = parseInt(start.split(':')[0], 10);
        const endHour = parseInt(end.split(':')[0], 10);
        hours = `از ${this.persianNumberPipe.transform(startHour)} تا ${this.persianNumberPipe.transform(endHour)}`;
      }

      let daysStr = '';
      if (indices.length === 1) {
        daysStr = dayNames[indices[0]];
      } else if (indices.length === 2) {
        daysStr = `${dayNames[indices[0]]} و ${dayNames[indices[1]]}`;
      } else {
        const first = indices[0];
        const last = indices[indices.length - 1];
        daysStr =
          indices.length === 7
            ? 'همه روزه'
            : `${dayNames[first]} تا ${dayNames[last]}`;
      }

      return `${daysStr}: ${hours}`;
    });

    return hoursList.join(', ');
  }
}
