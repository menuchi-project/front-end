import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardComponent } from './item-card.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Item } from '../../../user/models/Item';
import { TruncatePipe } from '../../pipes/truncate/truncate.pipe';
import { PersianPricePipe } from '../../pipes/persian-price/persian-price.pipe';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;

  const mockItem: Item = {
    name: 'Test Item',
    ingredients: 'Ingredient 1, Ingredient 2',
    price: 10000,
    picUrl: 'https://example.com/image.jpg',
    id: '1',
    deletedAt: '',
    createdAt: '',
    categoryId: '',
    categoryName: '',
    subCategoryId: '',
    positionInCategory: 1,
    positionInItemsList: 1,
    updatedAt: '',
    orderCount: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardComponent, TruncatePipe, PersianPricePipe],
      imports: [NzCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    component.data = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
