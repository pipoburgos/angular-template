import { inject } from '@angular/core'
import {
  HttpRequest,
  HttpResponse,
  HttpEvent,
  HttpHandlerFn,
} from '@angular/common/http'
import { of, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { CacheService } from '@shared'
import { environment } from 'src/enviroments/enviroment'

/**
 * Interceptor destinado a interceptar las peticiones http realizadas a la api y devolver respuestas cacheadas para las url configuradas.
 */
export function cachingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const cacheService = inject(CacheService)

  const isRequestCachable = (req: HttpRequest<unknown>): boolean => {
    let encontrado = false
    environment.cachable_urls.forEach(cachableUrl => {
      if (req.url === environment.rootUrl + cachableUrl) {
        encontrado = true
      }
    })
    return req.method === 'GET' && encontrado
  }

  if (!isRequestCachable(req)) {
    return next(req)
  }
  const cachedResponse = cacheService.get(req)
  if (cachedResponse !== null) {
    return of(cachedResponse)
  }
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cacheService.put(req, event)
      }
    }),
  )
}
