import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPageComponent } from './items-page.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserModule } from '../../user.module';
import { PlusOutline } from '@ant-design/icons-angular/icons';

describe('ItemsPageComponent', () => {
  let component: ItemsPageComponent;
  let fixture: ComponentFixture<ItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemsPageComponent],
      imports: [
        UserModule,
        NzInputGroupComponent,
        NzIconModule,
        NzIconModule.forChild([PlusOutline]),
      ],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
