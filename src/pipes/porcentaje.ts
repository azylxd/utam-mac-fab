import { Pipe } from '@angular/core';

@Pipe({
   name: 'porcentaje'
})
export class PorcentajePipe {
   // Formatea la Hora.
   // Input: {{'60.0' | formatoFecha}} (SI TERMINA EN PUNTO CERO LO CONVIERTO EN ENTERO)
   // Output: 60
   // Input: {{'60.3' | formatoFecha}}
   // Output: 60.3
   transform(value?) {
      if (value % 1 == 0) {
         return parseInt(value);
      }
      return value;
   }

}
