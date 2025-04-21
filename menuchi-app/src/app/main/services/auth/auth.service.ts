import { Injectable } from '@angular/core';
import { environment } from '../../../../../api-config/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, SignupRequest, SignupResponse } from '../../models/Auth';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.API_URL + '/auth';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  login(request: LoginRequest) {
    return this.httpClient.post<boolean>(this.apiUrl + '/res-signin', request);
  }

  signup(request: SignupRequest) {
    return this.httpClient.post<SignupResponse>(
      this.apiUrl + '/res-signup',
      request,
    );
  }

  fetchUserProfile() {
    return this.httpClient.get(environment.API_URL + '/users/profile').pipe(
      tap((user: any) => {
        this.userSubject.next(user);
      }),
      catchError((err) => {
        this.userSubject.next(null);
        return of(null);
      }),
    );
  }

  getRestaurantId(): string | null {
    return this.userSubject.value?.restaurants[0].id ?? null;
  }

  getBranchId(): string | null {
    return this.userSubject.value?.restaurants[0].branches[0].id ?? null;
  }

  getBacklogId(): string | null {
    return (
      this.userSubject.value?.restaurants?.[0]?.branches?.[0]?.backlogId ?? null
    );
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  logout(): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.apiUrl}/logout`, {});
  }
}
