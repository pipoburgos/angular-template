import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService, DialogService } from '@shared'
import { catchError } from 'rxjs'

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const dialogService = inject(DialogService)
  const authService = inject(AuthService)

  return next(req).pipe(
    catchError(error => {
      const { status } = error
      switch (status) {
        case 400:
          if (error.error.error === 'invalid_grant') {
            if (
              error.error.error_description === 'invalid_username_or_password'
            ) {
              dialogService.error('Las credenciales no son correctas.')
              throw error
            } else {
              throw authService.logout()
            }
          }
          throw processErrors(error)
        case 401:
          authService.logout()
          dialogService.error('No tienes permisos')
          throw error
        case 406:
          dialogService.error(error.error)
          throw error
        default:
          throw processErrors(error)
      }
    }),
  )
}

const processErrors = (error: HttpErrorResponse) => {
  if (typeof error.error === 'string') {
    const objError = JSON.parse(error.error)
    if (typeof objError === 'object') {
      throw objError.errors
    }
  }

  throw error.error
}
