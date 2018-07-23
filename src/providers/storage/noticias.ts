import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class NoticiasProvider {

   constructor(
      private storage: Storage
   ) { }

   /**
   *Obtiene las noticias desde el storage
   */
   getNoticiasData(): Promise<any> {
      return this.storage.get('noticias');
   }

}
