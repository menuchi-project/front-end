import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardContentComponent } from './dashboard-content.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { WeeklyCalendarComponent } from '../../../../main/components/weekly-calendar/weekly-calendar.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { of } from 'rxjs';
import { PersianNumberPipe } from '../../../../shared/pipes/persian-number/persian-number.pipe';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MenuService } from '../../../services/menu/menu.service';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../../main/services/auth/auth.service';
import { RestaurantService } from '../../../services/restaurant/restaurant.service';
import { Router } from '@angular/router';
import { DayMenuItem, Menu } from '../../../models/Menu';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PersianPricePipe } from '../../../../shared/pipes/persian-price/persian-price.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate/truncate.pipe';

describe('DashboardContentComponent', () => {
  let component: DashboardContentComponent;
  let fixture: ComponentFixture<DashboardContentComponent>;
  let mockMenuService: jasmine.SpyObj<MenuService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRestaurantService: jasmine.SpyObj<RestaurantService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockTodaysItems: DayMenuItem[] = [
    {
      id: 'item-1',
      name: 'Test Item 1',
      picUrl: 'test-url.jpg',
      price: 15000,
      categoryName: 'Main Course',
      ingredients: 'Test ingredients',
      categoryId: 'cat-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      positionInItemsList: 1,
      positionInCategory: 1,
      orderCount: 5,
      categoryNameId: '',
      isActive: false,
      positionInMenuCategory: 0,
    },
  ];

  const mockMenus: Menu[] = [
    {
      id: 'menu-1',
      branchId: 'branch-1',
      name: 'Mock Menu',
      favicon: 'icon.ico',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      restaurantId: 'restaurant-1',
      cylinders: [],
      cylindersCount: 1,
      categoriesCount: 1,
      itemsCount: 1,
    },
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUserName']);
    mockAuthService = jasmine.createSpyObj(
      'AuthService',
      ['getBranchId', 'getRestaurantId'],
      { user$: of({ id: 'user-1' }) },
    );
    mockMenuService = jasmine.createSpyObj(
      'MenuService',
      ['getAllMenusForBranches', 'getTodayMenuItems'],
      { menusData$: of(mockMenus) },
    );
    mockRestaurantService = jasmine.createSpyObj('RestaurantService', [
      'getRestaurantDetails',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockUserService.getUserName.and.returnValue('Test User');
    mockAuthService.getBranchId.and.returnValue('branch-1');
    mockAuthService.getRestaurantId.and.returnValue('restaurant-1');
    mockMenuService.getTodayMenuItems.and.returnValue(of(mockTodaysItems));
    mockRestaurantService.getRestaurantDetails.and.returnValue(
      of({
        displayName: 'Test Restaurant',
        branches: [],
      }),
    );

    await TestBed.configureTestingModule({
      declarations: [
        DashboardContentComponent,
        WeeklyCalendarComponent,
        PersianNumberPipe,
        PersianPricePipe,
        TruncatePipe,
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MenuService, useValue: mockMenuService },
        { provide: RestaurantService, useValue: mockRestaurantService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [NzIconModule, NzEmptyModule, NzCardModule, NzGridModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with today's item data", () => {
    expect(component.todaysItems).toBeDefined();
    expect(component.todaysItems.length).toBe(1);
    expect(component.todaysItems[0].picUrl).toBe('test-url.jpg');
    expect(mockMenuService.getTodayMenuItems).toHaveBeenCalled();
  });
});
