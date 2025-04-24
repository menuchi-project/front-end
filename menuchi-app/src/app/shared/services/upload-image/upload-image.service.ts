import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetUrlResponse, UploadUrlRequest } from '../../models/UploadImage';
import { Observable } from 'rxjs';
import { environment } from '../../../../../api-config/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private readonly apiUrl = environment.API_URL + '/s3';

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
      headers: new HttpHeaders({
        'Skip-Auth': 'true',
      }),
    });
  }
}
