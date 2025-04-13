import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlResponse, UploadUrlRequest } from '../../models/UploadImage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private readonly apiUrl = 'http://localhost:8000/s3';

  constructor(private httpClient: HttpClient) {}

  getUploadUrl(request: UploadUrlRequest): Observable<GetUrlResponse> {
    return this.httpClient.post<GetUrlResponse>(
      `${this.apiUrl}/get-item-pic-url`,
      request,
    );
  }

  uploadToSignedUrl(
    url: string,
    itemPicKey: string,
    file: File,
  ): Observable<any> {
    const formData = new FormData();
    formData.append(itemPicKey, file);

    return this.httpClient.put(url, file, {
      // headers: {
      //   'Content-Type': file.type,
      // },
    });
  }
}
