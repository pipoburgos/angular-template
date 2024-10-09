import { AbstractControl, ValidatorFn } from '@angular/forms'

export function compareDate(
  date: Date,
  comparison: '>' | '>=' | '===' | '<' | '<=',
  error: string,
): ValidatorFn {
  return (control: AbstractControl): Record<string, boolean> | null => {
    if (!date || !control.value || !(control.value instanceof Date)) return null
    switch (comparison) {
      case '>':
        return control.value.getTime() > date.getTime()
          ? null
          : { [error]: true }
      case '>=':
        return control.value.getTime() >= date.getTime()
          ? null
          : { [error]: true }
      case '===':
        return control.value.getTime() === date.getTime()
          ? null
          : { [error]: true }
      case '<':
        return control.value.getTime() < date.getTime()
          ? null
          : { [error]: true }
      case '<=':
        return control.value.getTime() <= date.getTime()
          ? null
          : { [error]: true }
      default:
        return null
    }
  }
}
