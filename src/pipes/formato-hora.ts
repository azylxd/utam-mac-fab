import moment from 'moment';
import { Injectable, Pipe } from '@angular/core';

@Pipe({
   name: 'formatoHora',
})
@Injectable()
export class FormatoHoraPipe {
   // Formatea la Hora.
   // Input: {{'08-12-1992 12:08' | formatoFecha}}
   // Output: 12:08
   transform(date?: any) {
      date = moment(date, "DD-MM-YYYY HH:mm").format("HH:mm");
      return date;
   }
}
