import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemComponent } from './cart-item.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { PersianNumberPipe } from '../../pipes/persian-number/persian-number.pipe';
import { TruncatePipe } from '../../pipes/truncate/truncate.pipe';
import { PersianPricePipe } from '../../pipes/persian-price/persian-price.pipe';

describe('CartItemComponent', () => {
  let component!: CartItemComponent;
  let fixture!: ComponentFixture<CartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CartItemComponent,
        PersianNumberPipe,
        TruncatePipe,
        PersianPricePipe,
      ],
      imports: [NzCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;

    component.item = {
      id: '1',
      createdAt: '',
      updatedAt: '',
      deletedAt: null,
      categoryId: 'cat1',
      subCategoryId: 'subcatA',
      categoryName: 'Category One',
      name: 'Test Item',
      ingredients: 'Ingredient 1, Ingredient 2',
      price: 100,
      picUrl: 'https://placehold.co/150x150/png?text=Item',
      positionInItemsList: 1,
      positionInCategory: 1,
      orderCount: 5,
    };
    component.quantity = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
