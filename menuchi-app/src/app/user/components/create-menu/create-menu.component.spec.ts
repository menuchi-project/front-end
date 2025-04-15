import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMenuComponent } from './create-menu.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserModule } from '../../user.module';

describe('CreateMenuComponent', () => {
  let component: CreateMenuComponent;
  let fixture: ComponentFixture<CreateMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMenuComponent],
      imports: [UserModule, NzInputGroupComponent, NzIconModule],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
