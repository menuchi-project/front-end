import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogPageComponent } from './backlog-page.component';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PlusOutline } from '@ant-design/icons-angular/icons';

describe('BacklogPageComponent', () => {
  let component: BacklogPageComponent;
  let fixture: ComponentFixture<BacklogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BacklogPageComponent],
      imports: [RouterModule.forRoot([]), NzIconModule.forChild([PlusOutline])],
    }).compileComponents();

    fixture = TestBed.createComponent(BacklogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
