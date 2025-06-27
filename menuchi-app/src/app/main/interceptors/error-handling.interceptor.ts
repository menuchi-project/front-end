import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {catchError, throwError} from 'rxjs';
import {AuthService} from '../services/auth/auth.service';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const message = inject(NzMessageService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401: // Unauthorized
          message.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.');
          authService.logout().subscribe({
            complete: () => {
              router.navigate(['/login']);
            },
          });
          break;

        case 403: // Forbidden
          message.error('شما برای انجام این عملیات دسترسی ندارید.');
          break;

        case 500: // Internal Server Error
        case 502: // Bad Gateway
        case 503: // Service Unavailable
          message.error('مشکلی در سرور رخ داده است. لطفاً بعداً تلاش کنید.');
          break;

        case 0: // Network Error or CORS
          message.error(
            'اتصال اینترنت برقرار نیست. لطفاً شبکه خود را بررسی کنید.'
          );
          break;
      }

      return throwError(() => error);
    })
  );
};
