import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `<h2 mat-dialog-title>Confirmación</h2>
    <mat-dialog-content>
      <p>¿Estás seguro de que deseas eliminar este elemento?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button color="warn" (click)="onConfirm()">Sí</button>
      <button mat-button (click)="onCancel()">No</button>
    </mat-dialog-actions> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  public constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  public onConfirm(): void {
    this.dialogRef.close(true)
  }

  public onCancel(): void {
    this.dialogRef.close(false)
  }
}
