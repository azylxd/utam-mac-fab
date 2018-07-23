import { Pipe } from '@angular/core';

@Pipe({
   name: 'tipoClase'
})
export class TipoClasePipe {
   // Devuelve el tipo de clase de acuerdo a la letra.
   // Input: {{'C' / 'L' / 'T' | tipoClase }}
   // Output: CÁTEDRA / LABORATORIO / TALLER
   transform(type?: any) {
      return (type === 'C') ? "CÁTEDRA" : (type === 'L') ? 'LABORATORIO' : (type === 'T') ? 'TALLER' : '';
   }

}

