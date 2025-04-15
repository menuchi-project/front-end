import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesPageComponent } from './categories-page.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserModule } from '../../user.module';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('CategoriesPageComponent', () => {
  let component: CategoriesPageComponent;
  let fixture: ComponentFixture<CategoriesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesPageComponent],
      imports: [UserModule, NzInputGroupComponent, NzIconModule],
      providers: [
        provideHttpClient(withFetch()),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [],
              data: {},
              parent: null,
              children: [],
            },
            data: of({}),
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
