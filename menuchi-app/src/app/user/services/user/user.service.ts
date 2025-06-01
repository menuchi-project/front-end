import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../../api-config/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.API_URL;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  fetchUserProfile(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/users/profile`).pipe(
      tap((user: any) => {
        this.userSubject.next(user);
      }),
      catchError((err) => {
        this.userSubject.next(null);
        return of(null);
      }),
    );
  }

  getUser() {
    return this.userSubject.value;
  }

  getUserName(): string {
    return this.userSubject.value?.username || 'کاربر ناشناس';
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

  clearUser() {
    this.userSubject.next(null);
  }
}