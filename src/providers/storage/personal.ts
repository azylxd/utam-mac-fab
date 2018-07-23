import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class PersonalProvider {

   constructor(
      private storage: Storage
   ) { }

   /**
  *Obtiene los datos personales desde el storage.
  */
   getPersonalData(): Promise<any> {
      return this.storage.get('personal');
   }

}
