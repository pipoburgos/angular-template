import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'

/** NO FUNCIONA */
@Component({
  selector: 'app-error-viewer',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule],
  template: `@if (control.invalid && (control.dirty || control.touched)) {
    <mat-error>
      @if (control.errors?.['required']) {
        <span>Este campo es obligatorio</span>
      }

      @if (control.errors?.['maxlength']) {
        <span>
          {{ control.errors?.['maxlength'].actualLength }} caracteres. La
          longitud máxima es de {{ control.errors?.['maxlength'].maxLength }}
        </span>
      }
    </mat-error>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorViewerComponent {
  @Input({ required: true }) public control!: FormControl
}
