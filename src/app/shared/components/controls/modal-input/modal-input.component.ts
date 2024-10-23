import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog'
import { TextAreaComponent } from '@shared'

export interface ModalInputValues {
  title: string
  maxLength: number
  label: string
  text: string | null | undefined
}

interface InputForm {
  text: FormControl<string>
}

@Component({
  selector: 'app-modal-input',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    TextAreaComponent,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>
        <app-text-area
          [control]="form.get('text')"
          [label]="data.label"
          [maxLength]="data.maxLength"
        ></app-text-area>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-raised-button cdkFocusInitial [disabled]="form.invalid">
          Guardar
        </button>
        <button mat-button type="button" (click)="cancel()">Cancelar</button>
      </mat-dialog-actions>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalInputComponent {
  @Output() public valueChange = new EventEmitter<string>()
  public readonly data = inject<ModalInputValues>(MAT_DIALOG_DATA)
  public form: FormGroup<InputForm>

  public constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      text: new FormControl(this.data?.text ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(this.data.maxLength),
        ],
      }),
    })
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  public cancel(): void {
    this.valueChange.emit()
  }

  public submit(): void {
    if (this.form.invalid) {
      return
    }

    this.valueChange.emit(this.form.value.text)
  }
}
