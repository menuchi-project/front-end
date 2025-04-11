import { Component, forwardRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { UploadImageService } from '../../services/upload-image/upload-image.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-upload-box',
  styleUrl: './upload-box.component.scss',
  templateUrl: './upload-box.component.html',
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
  picUrl: string = 'https://example.com/upload-endpoint';
  previewImage: string | undefined = '';
  previewVisible = false;
  fileList: NzUploadFile[] = [];
  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(
    private readonly messageService: NzMessageService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  writeValue(value: any): void {
    if (value) {
      this.fileList = [value];
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

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    this.fileList = fileList;

    if (file.status === 'done') {
      this.messageService.success(`${file.name} فایل با موفقیت آپلود شد.`);
      this.onChange(file); // <-- مقدار به فرم بده
    } else if (file.status === 'error') {
      this.messageService.error(`${file.name} آپلود با خطا مواجه شد.`);
      this.onChange(null);
    }
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    if (this.fileList.length >= 1) {
      this.messageService.error(' فقط یک فایل مجاز است.');
      return false;
    }
    return true;
  };
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
