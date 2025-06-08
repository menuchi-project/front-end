import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPageComponent } from './cart-page.component';
import { AuthService } from '../../../main/services/auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { SharedModule } from "../../../shared/shared.module";

describe('CartPageComponent', () => {
  let component: CartPageComponent;
  let fixture: ComponentFixture<CartPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CartPageComponent,
        NzCardModule,
        NzListModule,
        NzImageModule,
        NzTypographyModule,
        NzEmptyModule,
        SharedModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { 
          provide: AuthService, 
          useValue: { 
            getCustomerEmail: () => 'test@example.com',
          } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});