import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMenuComponent } from './create-menu.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TitleService } from '../../../shared/services/title/title.service';
import { ModalService } from '../../services/modal/modal.service';
import { DrawerService } from '../../services/drawer/drawer.service';
import { MenuService } from '../../services/menu/menu.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ItemService } from '../../services/item/item.service';
import { CreateMenuResponse, Menu } from '../../models/Menu';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateMenuComponent', () => {
  let component: CreateMenuComponent;
  let fixture: ComponentFixture<CreateMenuComponent>;

  let mockItemService: jasmine.SpyObj<ItemService>;
  let mockMenuService: jasmine.SpyObj<MenuService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTitleService: jasmine.SpyObj<TitleService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockDrawerService: jasmine.SpyObj<DrawerService>;
  let mockMessageService: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    const mockMenu: Menu = {
      id: 'menu-123',
      branchId: 'branch-123',
      name: 'Test Menu',
      favicon: 'icon.ico',
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      restaurantId: 'restaurant-456',
      cylinders: [],
      cylindersCount: 0,
      categoriesCount: 0,
      itemsCount: 0,
    };

    const mockCreateMenuResponse: CreateMenuResponse = {
      id: 'new-menu-id',
      branchId: 'branch-123',
      name: 'بدون نام',
      favicon: 'todo',
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      branch: null,
      restaurantId: 'restaurant-456',
    };

    mockItemService = jasmine.createSpyObj('ItemService', ['geAllItems'], {
      itemsData$: of([]),
    });

    mockMenuService = jasmine.createSpyObj(
      'MenuService',
      ['getMenuById', 'createMenu', 'updateMenu', 'addCategoryToMenu'],
      { currentMenuData$: of(mockMenu) },
    );

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'fetchUserProfile',
      'getBranchId',
      'getBacklogId',
    ]);

    mockTitleService = jasmine.createSpyObj('TitleService', [], {
      onPageChanged$: {
        next: () => {},
      },
    });
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal']);
    mockDrawerService = jasmine.createSpyObj('DrawerService', ['openDrawer']);
    mockMessageService = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);

    mockAuthService.getBranchId.and.returnValue('branch-123');
    mockAuthService.getBacklogId.and.returnValue('backlog-789');
    mockMenuService.createMenu.and.returnValue(of(mockCreateMenuResponse));

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    await TestBed.configureTestingModule({
      declarations: [CreateMenuComponent],
      imports: [
        FormsModule,
        DragDropModule,
        RouterTestingModule,
        NzInputGroupComponent,
        NzIconModule.forChild([PlusOutline]),
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: ItemService, useValue: mockItemService },
        { provide: MenuService, useValue: mockMenuService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TitleService, useValue: mockTitleService },
        { provide: ModalService, useValue: mockModalService },
        { provide: DrawerService, useValue: mockDrawerService },
        { provide: NzMessageService, useValue: mockMessageService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} },
            paramMap: of({}),
            queryParamMap: of({}),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
