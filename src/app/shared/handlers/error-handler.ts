import { Injectable, ErrorHandler } from '@angular/core'
import { DialogService } from '../services/dialog.service'

/**
 * Gestiona los errores de forma global dependiendo del entorno en que nos hallemos y el status del error.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  public constructor(private readonly dialogService: DialogService) {}

  public handleError(error: unknown): void {
    // // Si es un error generado en el backend
    // if (!environment.production) {
    //   // eslint-disable-next-line no-console
    //   console.error(error)
    // }

    // if (!error || error.status === 406) {
    //   return
    // } else if (error?.error && error.status === 400) {
    //   const errores =
    //     typeof error.error === 'string' ? JSON.parse(error.error) : error.error
    //   if (errores.errors) {
    //     return
    //   }
    // }

    // this.dialogService
    //   .erroresErrorHandler({
    //     body: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    //   })
    //   .subscribe()

    // eslint-disable-next-line no-console
    console.error(error)
    this.dialogService.error(error as string)
  }
}
