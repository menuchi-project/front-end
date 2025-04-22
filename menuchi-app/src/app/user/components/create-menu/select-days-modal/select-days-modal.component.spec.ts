import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDaysModalComponent } from './select-days-modal.component';

describe('SelectDaysModalComponent', () => {
  let component: SelectDaysModalComponent;
  let fixture: ComponentFixture<SelectDaysModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectDaysModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDaysModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
