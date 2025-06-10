import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreatedMenusPageComponent } from './created-menus-page.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

describe('CreatedMenusPageComponent', () => {
  let component: CreatedMenusPageComponent;
  let fixture: ComponentFixture<CreatedMenusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatedMenusPageComponent],
      imports: [
        FormsModule,
        RouterModule.forRoot([]),
        NzEmptyModule
      ],
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