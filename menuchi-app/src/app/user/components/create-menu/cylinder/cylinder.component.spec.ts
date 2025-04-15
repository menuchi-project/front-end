import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderComponent } from './cylinder.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('CylinderComponent', () => {
  let component: CylinderComponent;
  let fixture: ComponentFixture<CylinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CylinderComponent],
      imports: [NzIconModule],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(CylinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
