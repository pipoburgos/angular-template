import { Injectable } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms'
import { ModalConfig } from '@shared'

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  public constructor(private readonly formBuilder: FormBuilder) {}

  /** Establece en el formulario los errores del servidor */
  public setServerErrors(
    form: FormGroup,
    errors: Record<string, string[]>,
  ): void {
    Object.entries(errors).forEach(([controlName, errorsValue]) => {
      const control = form.get(controlName)
      if (control) {
        control.setErrors({ serverError: errorsValue })
      }
    })
  }

  /** Obtiene los mensajes de error de un control */
  public getErrorMessage(control: AbstractControl | null): string {
    if (
      !control ||
      !control.invalid ||
      !control.errors ||
      (!control.dirty && !control.touched)
    )
      return ''

    const errors: string[] = []
    if (control?.hasError('required')) {
      errors.push('Requerido')
    }
    if (control?.hasError('email')) {
      errors.push('Email incorrecto')
    }
    if (control?.hasError('maxlength')) {
      errors.push(
        `Longitud máxima de ${control.errors['maxlength'].requiredLength} (${control.errors['maxlength'].actualLength}) `,
      )
    }
    if (control?.hasError('minlength')) {
      errors.push(
        `Longitud mínima de ${control.errors['minlength'].requiredLength} (${control.errors['minlength'].actualLength}) `,
      )
    }
    if (control?.hasError('matDatepickerParse')) {
      errors.push('Fecha incorrecta')
    }
    if (control?.hasError('pattern')) {
      errors.push('Campo incorrecto')
    }

    if (control?.hasError('serverError')) {
      errors.push(control.errors['serverError'])
    }

    if (control?.hasError('compareDate')) {
      errors.push(control.errors['compareDate'])
    }
    return errors.join(', ')
  }

  /** Resumen de los errores de un formulario */
  public getErrorSummary(form: FormGroup): string {
    if (!form.invalid || !form.touched) return ''

    const errors: string[] = []
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key)
      errors.push(this.getErrorMessage(control))
    })

    return errors.join(', ')
  }

  public createForm(config: ModalConfig): FormGroup {
    const group: Record<string, FormControl> = {}

    config.fields.forEach(row =>
      row.forEach(field => {
        group[field.formControlName] = new FormControl(
          config.object ? config.object[field.formControlName] : null,
          field.validators,
        )
        if (field.disabled) group[field.formControlName].disable()
      }),
    )

    return this.formBuilder.group(group)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FieldConfig<T = any> {
  label: string
  formControlName: string
  type?: string // Tipo de input (para inputs)
  controlType: 'input' | 'datepicker' | 'textarea' | 'checkbox' | 'select'
  validators?: ValidatorFn | ValidatorFn[] | null
  width?: string
  rows?: number
  maxLength?: number
  disabled?: boolean
  options?: Option[]
  transformFn?: (value: T) => string
}

export interface Option {
  value: unknown // Tipo del valor de la opción
  label: string // Etiqueta que se mostrará en el select
}
