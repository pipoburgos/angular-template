import { ComponentType } from '@angular/cdk/portal'
import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfirmDialogComponent } from '@shared'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public constructor(
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
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
  ): Observable<Binding> {
    return this.dialog
      .open(component, {
        data: data,
        maxWidth: width,
        width: width,
        disableClose: true,
      })
      .afterClosed()
  }
}
