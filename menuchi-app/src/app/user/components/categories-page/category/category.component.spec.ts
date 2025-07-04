import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponent } from './category.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HolderOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { AddItemComponent } from '../../add-item/add-item.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryComponent, AddItemComponent],
      imports: [
        NzIconModule,
        DragDropModule,
        NzEmptyModule,
        NzModalModule,
        NzIconModule.forChild([PlusOutline, HolderOutline]),
      ],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;

    component.list = {
      categoryName: 'mock cat',
      positionInBacklog: 1,
      id: '1',
      deletedAt: '',
      createdAt: '',
      updatedAt: '',
      categoryNameId: '11',
      items: [],
      icon: '',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
