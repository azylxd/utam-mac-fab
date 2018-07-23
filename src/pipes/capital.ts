import { Pipe } from '@angular/core';

@Pipe({
   name: 'capital'
})

export class CapitalPipe {
   // Autocapitaliza la primera letra de cada palabra
   // Input: {{'john doe' | capital}}
   // Output: John Doe
   transform(value) {

      if (value) {
         return value.replace(/\w\S*/g, function (txt) {

            txt = txt.toLowerCase();
            switch (txt) {
               case 'de':
               case 'días':
               case 'minutos':
               case 'segundos':
               case 'e':
               case 'en':
               case 'y':
               case 'lun.':
               case 'mar.':
               case 'mié.':
               case 'jue.':
               case 'vie.':
               case 'sáb.':
               case 'dom.':
               case 'ene.':
               case 'feb.':
               case 'abr.':
               case 'may.':
               case 'jun.':
               case 'jul.':
               case 'ago.':
               case 'sep.':
               case 'oct.':
               case 'nov.':
               case 'dic.':
                  return txt
               case 'am':
                  return 'AM'
               case 'pm':
                  return 'PM'
               case 'acuna':
                  return 'Acuña'
               case 'informatica':
                  return 'Informática'
               case 'computacion':
                  return 'Computación'
               case 'pedagogia':
                  return 'Pedagogía'
               case 'educacion':
                  return 'Educación'
               case 'basica':
                  return 'Básica'
               case 'raul':
                  return 'Raúl'
               case 'hector':
                  return 'Héctor'
               case 'fernandez':
                  return 'Fernández'
               case 'mecanica':
                  return 'Mecánica'
               case 'electrica':
                  return 'Eléctrica'
               case 'electronica':
                  return 'Electrónica'
               case 'psicologia':
                  return 'Psicología'
               case 'ing.civil':
                  return 'Ing. Civil'
               default:
                  return txt.charAt(0).toUpperCase() + txt.substr(1);
            }
         });
      }

      return value;
   }
}
