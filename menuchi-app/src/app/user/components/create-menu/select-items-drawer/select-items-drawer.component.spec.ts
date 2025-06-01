import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectItemsDrawerComponent } from './select-items-drawer.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzDrawerComponent } from 'ng-zorro-antd/drawer';

describe('SelectItemsDrawerComponent', () => {
  let component: SelectItemsDrawerComponent;
  let fixture: ComponentFixture<SelectItemsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectItemsDrawerComponent],
      providers: [provideHttpClient(withFetch())],
      imports: [NzDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectItemsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
