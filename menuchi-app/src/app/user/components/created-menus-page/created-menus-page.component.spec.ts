import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedMenusPageComponent } from './created-menus-page.component';

describe('CreatedMenusPageComponent', () => {
  let component: CreatedMenusPageComponent;
  let fixture: ComponentFixture<CreatedMenusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatedMenusPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedMenusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
