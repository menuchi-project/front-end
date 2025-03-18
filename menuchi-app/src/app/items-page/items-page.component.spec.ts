import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPageComponent } from './items-page.component';

describe('ItemsPageComponent', () => {
  let component: ItemsPageComponent;
  let fixture: ComponentFixture<ItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
