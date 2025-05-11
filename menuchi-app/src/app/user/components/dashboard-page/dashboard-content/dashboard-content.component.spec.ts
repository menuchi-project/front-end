import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardContentComponent } from './dashboard-content.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { WeeklyCalendarComponent } from '../../../../main/components/weekly-calendar/weekly-calendar.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ItemService } from '../../../services/item/item.service';
import { of } from 'rxjs';
import { PersianNumberPipe } from '../../../../shared/pipes/persian-number/persian-number.pipe';

describe('DashboardContentComponent', () => {
  let component: DashboardContentComponent;
  let fixture: ComponentFixture<DashboardContentComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;

  beforeEach(async () => {
    // Create a mock ItemService
    mockItemService = jasmine.createSpyObj('ItemService', ['geAllItems']);
    mockItemService.itemsData$ = of([
      {
        picUrl: 'test-url.jpg',
        price: 1,
        categoryName: 'dd',
        categoryId: '111',
        ingredients: 'rrr',
        id: 'ee',
        createdAt: 'e',
        deletedAt: 'ff',
        updatedAt: 'f',
        subCategoryId: 'ff',
        name: 'fff',
        positionInItemsList: 1,
        positionInCategory: 1,
      },
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        DashboardContentComponent,
        WeeklyCalendarComponent,
        PersianNumberPipe,
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: ItemService, useValue: mockItemService },
      ],
      imports: [NzIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with item data', () => {
    expect(component.item).toBeDefined();
    expect(component.item.picUrl).toBe('test-url.jpg');
    expect(mockItemService.geAllItems).toHaveBeenCalled();
  });
});
