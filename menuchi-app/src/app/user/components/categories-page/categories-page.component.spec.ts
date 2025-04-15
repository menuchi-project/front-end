import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesPageComponent } from './categories-page.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('CategoriesPageComponent', () => {
  let component: CategoriesPageComponent;
  let fixture: ComponentFixture<CategoriesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesPageComponent],
      imports: [NzInputGroupComponent, NzIconModule],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
