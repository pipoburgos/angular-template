import { MatDateFormats } from '@angular/material/core'

export const SPANISH_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Para el input de fecha en formato dd/MM/yyyy
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Mostrar el input de fecha como dd/MM/yyyy
    monthYearLabel: 'MMM YYYY', // Etiqueta de mes y año
    dateA11yLabel: 'DD/MM/YYYY', // Formato accesible para la fecha
    monthYearA11yLabel: 'MMMM YYYY', // Formato accesible para mes y año
  },
}
