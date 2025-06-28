import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMenuViewerComponent } from './public-menu-viewer.component';

describe('PublicMenuViewerComponent', () => {
  let component: PublicMenuViewerComponent;
  let fixture: ComponentFixture<PublicMenuViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicMenuViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicMenuViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
