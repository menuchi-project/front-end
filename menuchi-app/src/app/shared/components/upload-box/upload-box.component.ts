import { Component, forwardRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { UploadImageService } from '../../services/upload-image/upload-image.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadUrlRequest } from '../../models/UploadImage';
import { AuthService } from '../../../main/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-box',
  templateUrl: './upload-box.component.html',
  styleUrl: './upload-box.component.scss',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadBoxComponent),
      multi: true,
    },
  ],
})
export class UploadBoxComponent implements ControlValueAccessor {
  fileList: NzUploadFile[] = [];
  previewVisible = false;
  previewImage: string | undefined = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private readonly messageService: NzMessageService,
    private readonly uploadImageService: UploadImageService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  writeValue(value: string | null): void {
    if (value) {
      this.fileList = [
        {
          uid: '-1',
          name: 'تصویر انتخاب‌شده',
          status: 'done' as const,
          url: value,
        },
      ];
    } else {
      this.fileList = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    if (this.fileList.length >= 1) {
      this.messageService.error(' فقط یک فایل قابل انتخاب است.');
      return false;
    }
    return true;
  };

  handleChange({ file }: NzUploadChangeParam): void {
    if (!file.originFileObj) return;

    // Only process when file status changes to 'uploading'
    if (file.status === 'uploading') {
      const rawFile = file.originFileObj;
      const timestamp = new Date().getTime();
      const fileName = `item-${timestamp}-${rawFile.name}`;

      const restaurantId = this.authService.getRestaurantId();
      const branchId = this.authService.getBranchId();

      if (!restaurantId || !branchId) {
        this.messageService.error(
          ' خطا در دریافت اطلاعات! لطفا دوباره وارد شوید.',
        );
        this.router.navigate(['/login']);
        return;
      }

      const uploadRequest: UploadUrlRequest = {
        restaurantId,
        branchId,
        fileName,
      };

      this.uploadImageService.getUploadUrl(uploadRequest).subscribe({
        next: (res) => {
          const { itemPicUrl, itemPicKey } = res;

          this.uploadImageService
            .uploadToSignedUrl(itemPicUrl, itemPicKey, rawFile)
            .subscribe({
              next: () => {
                this.messageService.success(' تصویر با موفقیت آپلود شد.');
                const updatedFile: NzUploadFile = {
                  ...file,
                  status: 'done' as const,
                  url: itemPicUrl.split('?')[0],
                };
                this.fileList = this.fileList.map((f) =>
                  f.uid === file.uid ? updatedFile : f,
                );
                this.onChange(itemPicKey);
              },
              error: () => {
                this.messageService.error(' خطا در آپلود تصویر.');
                const errorFile: NzUploadFile = {
                  ...file,
                  status: 'error' as const,
                };
                this.fileList = this.fileList.map((f) =>
                  f.uid === file.uid ? errorFile : f,
                );
                this.onChange(null);
              },
            });
        },
        error: () => {
          this.messageService.error(' دریافت لینک آپلود با خطا مواجه شد.');
          this.fileList = this.fileList.map((f) =>
            f.uid === file.uid ? { ...f, status: 'error' } : f,
          );
        },
      });
    }
  }

  handleCustomRequest = (item: NzUploadXHRArgs): Subscription => {
    // This dummy subscription prevents the default POST behavior
    return new Subscription(() => {});
  };
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
