import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogPageComponent } from './backlog-page.component';
import { RouterModule } from '@angular/router';

describe('BacklogPageComponent', () => {
  let component: BacklogPageComponent;
  let fixture: ComponentFixture<BacklogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BacklogPageComponent],
      imports: [RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BacklogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
