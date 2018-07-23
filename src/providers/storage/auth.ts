import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {
   constructor(
      private storage: Storage
   ) { }

	/**
	*Obtiene el ID de estudiante desde el storage
	*/
   getAuth(): Promise<any> {
      return this.storage.get('id_estudiante')
   }

   getSincronizacionLogout(): Promise<any[]> {
      return this.storage.get('sincronizar_logout')
      .then(data => !data ? [] : data);
   }

   setSincronizacionLogout(logout, conjunto_logouts?) {
      if (!conjunto_logouts) {
         return this.getSincronizacionLogout()
            .then(logouts => {
               logouts.push(logout);
               return logouts;
            })
            .then(logouts => this.storage.set('sincronizar_logout', logouts));
      }
      else {
         return this.storage.set('sincronizar_logout', logout);
      }
   }

   getSincronizacionEnvioIds(): Promise<any[]> {
      return this.storage.get('sincronizar_envio_id')
         .then(ids => !ids ? [] : ids);
   }

   setSincronizacionEnvioIds(envio_id, conjunto_envios_id?) {
      if (!conjunto_envios_id) {
         return this.getSincronizacionEnvioIds()
            .then(conjuntos_envios => {
               conjuntos_envios.push(envio_id);
               return conjuntos_envios;
            })
            .then(conjunto_envios => this.storage.set('sincronizar_envio_id', conjunto_envios));
      }
      else {
         return this.storage.set('sincronizar_envio_id', envio_id);
      }
   }
}

