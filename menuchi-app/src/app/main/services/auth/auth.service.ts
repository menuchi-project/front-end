import { Injectable } from '@angular/core';
import { environment } from '../../../../../api-config/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, SignupRequest, SignupResponse } from '../../models/Auth';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserService } from '../../../user/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.API_URL + '/auth';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  login(request: LoginRequest): Observable<boolean> {
    return this.httpClient.post<boolean>(this.apiUrl + '/res-signin', request).pipe(
      tap((response) => {
        if (response) {
          this.fetchUserProfile().subscribe();
        }
      }),
    );
  }

  signup(request: SignupRequest): Observable<SignupResponse> {
    return this.httpClient.post<SignupResponse>(this.apiUrl + '/res-signup', request);
  }

  fetchUserProfile(): Observable<any> {
    return this.userService.fetchUserProfile().pipe(
      tap((user) => {
        this.userSubject.next(user);
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
    return this.userSubject.value?.restaurants?.[0]?.branches?.[0]?.backlogId ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  logout(): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.userService.clearUser();
      }),
    );
  }

  getUser() {
    return this.userSubject.value;
  }

  getUserName(): string {
    return this.userSubject.value?.username || 'کاربر ناشناس';
  }
}