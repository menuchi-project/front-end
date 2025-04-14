import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCollapseComponent } from './category-collapse.component';

describe('CategoryCollapseComponent', () => {
  let component: CategoryCollapseComponent;
  let fixture: ComponentFixture<CategoryCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryCollapseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
