import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDaysModalComponent } from './select-days-modal.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzModalModule } from 'ng-zorro-antd/modal';

describe('SelectDaysModalComponent', () => {
  let component: SelectDaysModalComponent;
  let fixture: ComponentFixture<SelectDaysModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectDaysModalComponent],
      providers: [provideHttpClient(withFetch())],
      imports: [NzModalModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDaysModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
