import type {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { Observable, catchError, switchMap } from 'rxjs'
import { environment } from 'src/enviroments/enviroment'
import { AuthService, TokenResponse } from '../services/auth.service'

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (environment.withCredentials) {
    return next(req.clone({ withCredentials: true }))
  } else {
    const authService = inject(AuthService)
    const { hasToken, access_token } = authService
    if (hasToken) {
      const reqWithToken = req.clone({
        setHeaders: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      return next(reqWithToken).pipe(
        catchError(err => {
          if (err && err.status === 403) {
            return refreshTokenMethod(req, next, authService)
          }
          throw err
        }),
      )
    } else {
      return next(req)
    }
  }
}

const refreshTokenMethod = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
): Observable<HttpEvent<unknown>> => {
  return authService.refreshToken().pipe(
    switchMap((tokenResponse: TokenResponse) => {
      const reqWithToken = request.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
      return next(reqWithToken)
    }),
  )
}
