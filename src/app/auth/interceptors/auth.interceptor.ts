import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    const token = localStorage.getItem('token') ?? '';
    const cloneReq = request.clone({
      setHeaders: {
        Authorization: token,
      },
    });
    return next(cloneReq);
  }

  return next(request);
};
