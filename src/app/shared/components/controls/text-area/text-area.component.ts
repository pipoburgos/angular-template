import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { ErrorViewerComponent } from '@shared'
import { FormsService } from '../../../services/forms.service'

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, ErrorViewerComponent],
  template: `<mat-form-field appearance="fill" [style.width.%]="100">
    <mat-label>{{ label }}</mat-label>
    <textarea
      matInput
      [formControl]="formControl"
      [rows]="rows"
      (keydown)="onKeyDown($event)"
    ></textarea>
    <mat-error> {{ formsService.getErrorMessage(control) }}</mat-error>
  </mat-form-field> `,
  styles: [
    `
      :host {
        display: block;

        /* Ocultar las flechas del input type=number */
        /* Para Chrome, Edge y Safari */
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Para Firefox */
        input[type='number'] {
          -moz-appearance: textfield;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent {
  @Input({ required: true }) public control!: AbstractControl | null
  @Input({ required: true }) public label!: string
  @Input({ required: true }) public maxLength = 0
  @Input() public rows = 3

  public get formControl(): FormControl {
    if (this.control instanceof FormControl) return this.control
    throw new Error('Control no encontrado')
  }

  public constructor(public readonly formsService: FormsService) {}

  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }
}
