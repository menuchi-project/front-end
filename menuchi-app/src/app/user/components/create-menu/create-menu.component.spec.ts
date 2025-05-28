import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMenuComponent } from './create-menu.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserModule } from '../../user.module';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('CreateMenuComponent', () => {
  let component: CreateMenuComponent;
  let fixture: ComponentFixture<CreateMenuComponent>;

  const mockActivatedRoute = {
    paramMap: of({ get: (key: string) => 'testId' }),
    snapshot: {
      paramMap: {
        get: (key: string) => 'testId',
      },
    },
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    url: '/dashboard/preview',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMenuComponent],
      imports: [
        UserModule,
        NzInputGroupComponent,
        NzIconModule,
        NzIconModule.forChild([PlusOutline]),
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
