import { Injectable, Pipe } from '@angular/core';
import moment from 'moment';

@Pipe({
   name: 'formatoFecha'
})
@Injectable()
export class FormatoFechaPipe {
   // Formatea la Fecha.
   // Input: {{'1992-12-08' | formatoFecha}}
   // Input: {{'08-12-1992' | formatoFecha}}
   // Input: {{'08-12-1992 12:00' | formatoFecha}}
   // Output: 08/12/1992
   transform(date?: any) {

      if (moment(date, "YYYY-MM-DD", true).isValid()) {
         date = moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
      }
      else if (moment(date, "DD-MM-YYYY", true).isValid()) {
         date = moment(date, "DD-MM-YYYY").format("DD/MM/YYYY");
      }
      else if (moment(date, "DD-MM-YYYY HH:mm", true).isValid()) {
         date = moment(date, "DD-MM-YYYY HH:mm").format("DD/MM/YYYY");
      }

      return date;
   }
}

