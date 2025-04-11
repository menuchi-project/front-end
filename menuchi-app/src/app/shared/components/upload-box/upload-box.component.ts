import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { UploadImageService } from '../../services/upload-image/upload-image.service';

@Component({
  selector: 'app-upload-box',
  styleUrl: './upload-box.component.scss',
  templateUrl: './upload-box.component.html',
  standalone: false,
})
export class UploadBoxComponent {
  picUrl: string = 'https://example.com/upload-endpoint';
  previewImage: string | undefined = '';
  previewVisible = false;
  fileList: NzUploadFile[] = [];

  constructor(
    private readonly messageService: NzMessageService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    this.fileList = fileList;

    if (file.status === 'done') {
      this.messageService.success(`${file.name} فایل با موفقیت آپلود شد.`);
    } else if (file.status === 'error') {
      this.messageService.error(`${file.name} آپلود با خطا مواجه شد.`);
    }

    // if (fileList.length > 1) {
    //   this.messageService.warning('فقط یک فایل مجاز است.');
    //   this.fileList = fileList.slice(0, 1); // فقط یک فایل بگذار
    // }
    //
    // // اگر وضعیت فایل "done" باشد (یعنی آپلود موفق بوده)
    // if (file.status === 'done') {
    //   this.messageService.success(` ${file.name} فایل با موفقیت آپلود شد.`);
    // }
    //
    // // اگر وضعیت فایل "error" باشد (یعنی آپلود شکست خورده)
    // if (file.status === 'error') {
    //   this.messageService.error(` ${file.name} آپلود با خطا مواجه شد.`);
    // }
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
