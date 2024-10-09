import { DatePipe } from '@angular/common'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'fecha',
  standalone: true,
})
export class FechaPipe implements PipeTransform {
  public constructor(private readonly datePipe: DatePipe) {}

  public transform(value: Date | string | number): string | null {
    if (value === null || value === undefined) {
      return ''
    }

    // Use the Angular DatePipe to format the date
    return this.datePipe.transform(value, 'dd/MM/yyyy')
  }
}
