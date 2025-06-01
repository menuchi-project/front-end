import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDaysComponent } from './select-days.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

describe('SelectDaysComponent', () => {
  let component: SelectDaysComponent;
  let fixture: ComponentFixture<SelectDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectDaysComponent],
      imports: [NzModalModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
