import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AsignaturasProvider {

      asignaturas: any[] = [];

      constructor(
            private storage: Storage
      ) { }


      getAsignaturaData(id_asignatura: string) {
            return this.getAsignaturasData()
                  .then(asignaturas => {
                        console.log("asignaturas: ", asignaturas);
                        asignaturas.find(asignatura => asignatura._id == id_asignatura) || {};
                  })
      }

      getAsignaturasData() {
            console.log("getAsignaturas...");
            return this.storage.get('asignaturas')
                  .then(data => !data ? [] : data);
      }

      getSubjectById(id_subject) {
            return this.getAsignaturasData()
                  .then((result) => {
                        return result[id_subject]
                  })
      }
}
