import { AbstractControl, ValidatorFn } from '@angular/forms'
import { isMoment } from 'moment'

export function compareDate(
  date: Date | undefined,
  comparison: '>' | '>=' | '===' | '<' | '<=',
): ValidatorFn {
  return (control: AbstractControl): Record<string, string[]> | null => {
    if (!date || !control.value) return null

    let actual: Date
    if (isMoment(control.value)) {
      actual = control.value.toDate()
    } else if (control.value instanceof Date) {
      actual = control.value
    } else {
      return null
    }

    let before: Date
    if (isMoment(date)) {
      before = date.toDate()
    } else if (date instanceof Date) {
      before = date
    } else {
      return null
    }

    switch (comparison) {
      case '>':
        return actual.getTime() > before.getTime()
          ? null
          : { ['compareDate']: ['Fecha inválida'] }
      case '>=':
        return actual.getTime() >= before.getTime()
          ? null
          : { ['compareDate']: ['Fecha inválida'] }
      case '===':
        return actual.getTime() === before.getTime()
          ? null
          : { ['compareDate']: ['Fecha inválida'] }
      case '<':
        return actual.getTime() < before.getTime()
          ? null
          : { ['compareDate']: ['Fecha inválida'] }
      case '<=':
        return actual.getTime() <= before.getTime()
          ? null
          : { ['compareDate']: ['Fecha inválida'] }
      default:
        return null
    }
  }
}
