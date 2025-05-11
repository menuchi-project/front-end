import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsTableComponent } from './items-table.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { NzImageModule } from 'ng-zorro-antd/image';

describe('ItemsTableComponent', () => {
  let component: ItemsTableComponent;
  let fixture: ComponentFixture<ItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemsTableComponent],
      imports: [
        NzImageModule,
        NzTableModule,
        NzIconModule.forChild([PlusOutline]),
      ],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
