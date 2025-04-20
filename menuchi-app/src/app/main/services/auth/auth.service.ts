import { Injectable } from '@angular/core';
import { environment } from '../../../../../api-config/api-url';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, SignupRequest, SignupResponse } from '../../models/Auth';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  login(request: LoginRequest) {
    return this.httpClient.post<boolean>(this.apiUrl + '/res-signin', request, {
      withCredentials: true,
    });
  }

  signup(request: SignupRequest) {
    return this.httpClient.post<SignupResponse>(
      this.apiUrl + '/res-signup',
      request,
    );
  }

  fetchUserProfile() {
    return this.httpClient
      .get(environment.apiUrl + '/users/profile', { withCredentials: true })
      .pipe(
        tap((user: any) => {
          this.userSubject.next(user);
        }),
        catchError((err) => {
          this.userSubject.next(null);
          return of(null);
        }),
      );
  }

  getBacklogId(): string | null {
    return (
      this.userSubject.value?.restaurants?.[0]?.branches?.[0]?.backlogId ?? null
    );
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}
