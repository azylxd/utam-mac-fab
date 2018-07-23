import { Injectable, Pipe } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'ordenarFecha',
})
@Injectable()
export class OrdenarFechaPipe {
  
  /**
  * Ordena el array por fecha.
  */
  transform(array) {
    let nuevo_array = array.sort((a, b) => {
      a = moment(a.ULTIMO_MENSAJE, "DD-MM-YYYY HH:mm");
      b = moment(b.ULTIMO_MENSAJE, "DD-MM-YYYY HH:mm");
      return a > b ? -1 : a < b ? 1 : 0;
    });
    console.log("nuevo array: ", nuevo_array);
    return nuevo_array;

  }
}
