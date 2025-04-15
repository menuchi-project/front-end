import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { UploadBoxComponent } from './upload-box.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';

describe('UploadBoxComponent', () => {
  let component: UploadBoxComponent;
  let fixture: ComponentFixture<UploadBoxComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UploadBoxComponent],
      imports: [NzUploadModule, NzModalModule],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
