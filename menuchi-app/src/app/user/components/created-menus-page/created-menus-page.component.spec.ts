import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreatedMenusPageComponent } from './created-menus-page.component';

describe('CreatedMenusPageComponent', () => {
  let component: CreatedMenusPageComponent;
  let fixture: ComponentFixture<CreatedMenusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatedMenusPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
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