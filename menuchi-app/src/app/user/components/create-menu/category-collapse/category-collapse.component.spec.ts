import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCollapseComponent } from './category-collapse.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import {
  NzCardComponent,
  NzCardMetaComponent,
  NzCardModule,
} from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('CategoryCollapseComponent', () => {
  let component: CategoryCollapseComponent;
  let fixture: ComponentFixture<CategoryCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryCollapseComponent],
      imports: [
        NzCollapseModule,
        CdkDropList,
        CdkDrag,
        NzCardMetaComponent,
        NzCardModule,
        NzIconModule,
      ],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
