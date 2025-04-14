import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderComponent } from './cylinder.component';

describe('CylinderComponent', () => {
  let component: CylinderComponent;
  let fixture: ComponentFixture<CylinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CylinderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CylinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
