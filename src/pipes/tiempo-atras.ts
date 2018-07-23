import moment from 'moment';
import { Injectable, Pipe } from '@angular/core';

@Pipe({
   name: 'tiempoAtras'
})
@Injectable()
export class TiempoAtrasPipe {
   // Devuelve el tiempo que ha pasado desde esa fecha a la fecha actual (estilo mensajería de facebook).
   // Input: {{'08-12-1992 12:08' | formatoFecha}}
   // Output: lun. / 'mar' / mie. / jue / vie / sáb / dom
   // Output: 1 ene. / 31 dic. 

   transform(date?: any) {
      moment.locale('es');

      //FORMATO DE ENTRADA - FORMATO DE SALIDA
      let date_tmp = moment(date, "DD-MM-YYYY HH:mm").format();
      
      if (moment().diff(date_tmp, 'minutes') < 60) {
         return moment(date_tmp || new Date().toISOString()).fromNow();
      }
      else if (moment().isSame(date_tmp, 'day')) {
         return moment(date_tmp, moment.ISO_8601).format("HH:mm a");
      }
      else if (moment().diff(date_tmp, 'days') < 7) { //sáb. vie. jue. mie. mar. lun.
         return moment(date_tmp, moment.ISO_8601).format("ddd");
      }
      else {
         return moment(date_tmp, moment.ISO_8601).format("DD MMM");
      }

   }

}
