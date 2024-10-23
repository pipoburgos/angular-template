import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'euros',
  standalone: true,
})
export class EurosPipe implements PipeTransform {
  public transform(value: number, currencySymbol = '€'): string {
    if (value === null || value === undefined || value === 0) {
      return ''
    }
    const formattedValue = value.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    })
    return `${formattedValue} ${currencySymbol}`
  }
}
