import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class RecursosProvider {
   constructor(
      private storage: Storage
   ) { }

	/**
	*Obtiene los recursos desde el storage.
	*/
   getRecursosData(): Promise<any> {
      return this.storage.get('recursos');
   }
}
