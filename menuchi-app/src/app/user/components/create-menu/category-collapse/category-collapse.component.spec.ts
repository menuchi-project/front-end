import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCollapseComponent } from './category-collapse.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { NzCardMetaComponent, NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  NzDropdownMenuComponent,
  NzDropDownModule,
} from 'ng-zorro-antd/dropdown';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { SharedModule } from '../../../../shared/shared.module';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

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
        NzDropdownMenuComponent,
        FormsModule,
        NzCheckboxModule,
        NzDropDownModule,
        SharedModule,
      ],
      providers: [provideHttpClient(withFetch()), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
