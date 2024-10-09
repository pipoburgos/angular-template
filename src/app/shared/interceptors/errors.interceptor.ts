import { inject } from '@angular/core'
import {
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { DialogService } from '@shared'

export function errorsInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const dialogService = inject(DialogService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      dialogService.error(error?.error ?? 'Ocurrió un error inesperado.')
      return throwError(() => error)
    }),
  )
}
