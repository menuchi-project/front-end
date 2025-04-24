import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectItemsDrawerComponent } from './select-items-drawer.component';

describe('SelectItemsDrawerComponent', () => {
  let component: SelectItemsDrawerComponent;
  let fixture: ComponentFixture<SelectItemsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectItemsDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectItemsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
