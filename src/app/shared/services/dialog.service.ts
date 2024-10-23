import { ComponentType } from '@angular/cdk/portal'
import { Injectable } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  ConfirmDialogComponent,
  FormModalComponent,
  ModalConfig,
} from '@shared'
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs'
import { FormsService } from './forms.service'

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public constructor(
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly formsService: FormsService,
  ) {}

  public info(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3_000,
    })
  }

  public error(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 10_000,
    })
  }

  public openConfirmDialog(): Observable<unknown> {
    return this.dialog.open(ConfirmDialogComponent).afterClosed()
  }

  public openComponentDialog<Component, Binding>(
    component: ComponentType<Component>,
    data?: Binding,
    width?: string,
  ): MatDialogRef<Component, Binding> {
    return this.dialog.open(component, {
      data: data,
      maxWidth: width,
      width: width,
      disableClose: true,
      closeOnNavigation: true,
    })
  }

  public openFormDialog<Item>(
    config: ModalConfig,
    object: Item | undefined,
    observableFn: (value: Item) => Observable<Item | null | void>,
  ): Observable<Item | null | void> {
    // Establecemos el objeto pasado en la configuración del formulario
    config.object = object

    // Abrimos el diálogo con el componente correspondiente
    const dialogRef = this.dialog.open(FormModalComponent, {
      data: config,
      maxWidth: config.width,
      width: config.width,
      disableClose: true,
      closeOnNavigation: true,
    })

    // Retornamos un observable que depende del valor del formulario
    return dialogRef.componentInstance.valueChange.pipe(
      switchMap(value => {
        if (!value) {
          // Si el valor es nulo, cerramos el diálogo y devolvemos null
          dialogRef.close()
          return of()
        }

        // Generamos el observable dinámicamente usando el valor del formulario
        const observable = observableFn(value)

        return observable.pipe(
          catchError(err => {
            this.formsService.setServerErrors(
              dialogRef.componentInstance.form,
              err,
            )
            return throwError(() => err)
          }),
          tap(() => {
            dialogRef.close()
          }),
        )
      }),
    )
  }
}
