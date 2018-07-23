import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class StorageProvider {

      constructor(
            public storage: Storage
      ) { }

	/**
	*Recibe un objeto con todos los datos de la app. Formatea los datos y luego los inserta en el storage
	*/
      almacenarDatos(data) {
            console.log("almacenando datos...");
            let promises = [];
            Object.keys(data).forEach(key => promises.push(this.storage.set(key, data[key])));
            return Promise.all(promises);
            /*Object.keys(data).forEach(key => {
               let registro = data[key];
               if (key == 'MensajeNoLeido') {
                  promises.push(this.storage.set('mensajes_resumen', registro));
               }
               else {
                  promises.push(this.storage.set(key, registro));
               }
            });*/
      }

      eliminarDatos() {
            return this.storage.keys()
                  .then(keys => {
                        keys.forEach(key => {
                              if ((key != "sincronizar_mensajes") && (key != "sincronizar_logout")) this.storage.remove(key);
                        });
                  });
      }

}
