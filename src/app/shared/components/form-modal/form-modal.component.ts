import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { FieldConfig, FormsService, TextAreaComponent } from '@shared'

export interface ModalConfig {
  title: string
  width: string
  fields: FieldConfig[][]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object?: any
}

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    TextAreaComponent,
  ],
  templateUrl: './form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModalComponent {
  @Output() public valueChange = new EventEmitter()
  public readonly config = inject<ModalConfig>(MAT_DIALOG_DATA)
  public form: FormGroup

  public constructor(public readonly formsService: FormsService) {
    this.form = formsService.createForm(this.config)
  }

  public cancel(): void {
    this.valueChange.emit()
  }

  public submit(): void {
    if (this.form.invalid) {
      return
    }

    this.valueChange.emit(this.form.value)
  }
}
