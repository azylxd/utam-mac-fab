import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class MensajesProvider {

   constructor(
      private storage: Storage
   ) { }

   /**
   *Obtiene los todos mensajes desde el storage
   */
   getMensajesData(): Promise<any> {
      return this.storage.get('mensajes');
   }

   getMensajesAsignatura(cod_periodo, cod_asignatura) {
      return this.storage.get('mensajes')
         .then(mensajes => {
            return mensajes ? mensajes[cod_periodo][cod_asignatura] : {}
         });
   }

   /**
  *Obtiene el resumen de mensajes desde el storage
  */
   getResumenMensajesData(): Promise<any> {
      //return this.storage.get('mensajes_resumen');
      return this.storage.get('MensajeNoLeido');
   }

   setSincronizacionPendiente(mensaje, conjunto_mensajes?) {
      if (!conjunto_mensajes) {
         return this.getSincronizacionLecturaMensajes()
            .then(mensajes => {
               mensajes.push(mensaje);
               return mensajes;
            })
            .then(mensajes => this.storage.set('sincronizar_mensajes', mensajes));
      }
      else {
         return this.storage.set('sincronizar_mensajes', mensaje);
      }
   }

   getSincronizacionLecturaMensajes(): Promise<any[]> {
      return this.storage.get('sincronizar_mensajes')
         .then(mensajes => !mensajes ? [] : mensajes);
   }

   setResumenMensajesData(mensajes_resumen) {
      return this.storage.set('mensajes_resumen', mensajes_resumen);
   }

   setMensajesData(mensajes) {
      return this.storage.set('mensajes', mensajes);
   }



}
