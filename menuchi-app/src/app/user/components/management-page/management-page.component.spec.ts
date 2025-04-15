import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementPageComponent } from './management-page.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SharedModule } from '../../../shared/shared.module';
import { of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';

describe('ManagementPageComponent', () => {
  let component: ManagementPageComponent;
  let fixture: ComponentFixture<ManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementPageComponent],
      imports: [
        NzLayoutModule,
        NzIconModule,
        SharedModule,
        RouterModule.forRoot([]),
      ],
      providers: [
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

    fixture = TestBed.createComponent(ManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
