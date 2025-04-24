import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('Skip-Auth')) {
    const newHeaders = req.headers.delete('Skip-Auth');
    const skippedReq = req.clone({ headers: newHeaders });
    return next(skippedReq);
  }

  const cloned = req.clone({
    withCredentials: true,
  });

  return next(cloned);
};
