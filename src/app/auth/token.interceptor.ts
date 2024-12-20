import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { BACKEND_URL } from '../services/tokens';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.url.includes('/api/user/login') || req.url.includes('/api/user/register') || req.url.includes('api/token/refresh')){
    return next(req);
  }
  
  const backendUrl = inject(BACKEND_URL);
  const authService = inject(AuthService);
  const http = inject(HttpClient);

  const accessToken = authService.getAccessTokenFromLocalStorage();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  return next(authReq).pipe(
    catchError((error) => {
      if(error.status == 401){
        console.log('Access token has expired, fetching a new one...');
        
        let refreshToken = authService.getRefreshTokenFromLocalStorage();

        return http.post(backendUrl + 'api/token/refresh/', {
          refresh: refreshToken
        }).pipe(
          switchMap((res: any) => {
            authService.storeNewAccessToken(res.access);

            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.access}`,
              },
            })

            return next(newAuthReq); 
          }),
          catchError((refreshError) => {
            console.log('Refresh token failed. Logging out...');
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
