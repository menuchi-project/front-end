import {
  Component,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { DayMenuItem, Menu } from '../../../models/Menu';
import { UserService } from '../../../services/user/user.service';
import { MenuService } from '../../../services/menu/menu.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../main/services/auth/auth.service';
import { RestaurantService } from '../../../services/restaurant/restaurant.service';
import { Branch, OpeningTimes, Restaurant } from '../../../models/restaurant';
import { Router } from '@angular/router';
import { PersianNumberPipe } from '../../../../shared/pipes/persian-number/persian-number.pipe';

@Component({
  selector: 'app-dashboard-content',
  standalone: false,
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
  providers: [PersianNumberPipe],
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  todaysItems: DayMenuItem[] = [];
  currentItemIndex = 0;
  menus: Menu[] = [];
  userName: string = 'کاربر';
  visibleMenus: Menu[] = [];
  currentIndex = 0;
  visibleBranches: Branch[] = [];
  branchCurrentIndex = 0;
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
  private menusSubscription!: Subscription;

  constructor(
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

              if (menus.length > 0) {
                this.getTodaysItems();
              }
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

              this.updateVisibleBranches();

              if (this.branchId) {
                const branch = this.restaurant.branches.find(
                  (b: Branch) => b.id === this.branchId,
                );
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

              this.updateVisibleBranches();
            },
          }),
      );
    }
  }

  getTodaysItems() {
    const todaysItemsSub = this.menuService.getTodayMenuItems().subscribe({
      next: (items) => {
        this.todaysItems = items;
        this.currentItemIndex = 0;
      },
      error: (err) => {
        console.error('خطا در دریافت آیتم‌های امروز:', err);
        this.todaysItems = [];
      },
    });
    this.subscriptions.add(todaysItemsSub);
  }

  changeTodaysItem(direction: 'prev' | 'next') {
    if (
      direction === 'next' &&
      this.currentItemIndex < this.todaysItems.length - 1
    ) {
      this.currentItemIndex++;
    } else if (direction === 'prev' && this.currentItemIndex > 0) {
      this.currentItemIndex--;
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
    this.subscriptions.unsubscribe();
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

  updateVisibleBranches() {
    const branches = this.restaurant.branches || [];
    this.visibleBranches = branches.slice(
      this.branchCurrentIndex,
      this.branchCurrentIndex + 2,
    );
  }

  scrollBranches(direction: 'left' | 'right') {
    if (direction === 'left' && this.branchCurrentIndex > 0) {
      this.branchCurrentIndex--;
    } else if (
      direction === 'right' &&
      this.branchCurrentIndex + 2 < this.restaurant.branches.length
    ) {
      this.branchCurrentIndex++;
    }
    this.updateVisibleBranches();
  }
}
