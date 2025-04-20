import { Injectable } from '@angular/core';
import { environment } from '../../../../../api-config/api-url';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, SignupRequest } from '../../models/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';

  // private getCategoryNamesData = new Subject<CategoryName[]>();
  // getCategoryNamesData$ = this.getCategoryNamesData.asObservable();

  constructor(private httpClient: HttpClient) {}

  login(request: LoginRequest) {
    return this.httpClient.post<boolean>(this.apiUrl + '/res-signin', request, {
      withCredentials: true,
    });
  }

  signup(request: SignupRequest) {
    return this.httpClient
      .post<any>(this.apiUrl + '/res-signup', request)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
