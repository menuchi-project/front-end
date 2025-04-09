import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { UploadBoxComponent } from './upload-box.component';

describe('UploadBoxComponent', () => {
  let component: UploadBoxComponent;
  let fixture: ComponentFixture<UploadBoxComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UploadBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
