import { Pipe } from '@angular/core';

@Pipe({
   name: 'keys',
})
export class KeysPipe {

   // Retorna el array de claves
   // Input: {{array}} | formatoFecha}}
   // 
   // Output: ["", "", ""]

   transform(value): any {
      let keys = [];
      for (let key in value) {
         keys.push(key);
      }
      return keys;
   }

}
