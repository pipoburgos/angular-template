import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import {
  cachingInterceptor,
  errorsInterceptor,
  GlobalErrorHandler,
  spinnerInterceptor,
  tokenInterceptor,
} from '@shared'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        errorsInterceptor,
        spinnerInterceptor,
        cachingInterceptor,
        tokenInterceptor,
      ]),
    ),
    provideAnimationsAsync(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
}
