import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class InscripcionesProvider {

      datos_inscripciones;

      constructor(
            private storage: Storage
      ) { }

      /**
      *Obtiene todas las asignaturas (inscripciones) desde el storage.
      */
      getInscripcionesData() {
            return this.storage.get('inscripcion')
      }

      getInscripcionesPeriodo(cod_periodo) {
            return this.storage.get('inscripcion')
                  .then(inscripciones => {
                        return inscripciones ? inscripciones[cod_periodo] : {};
                  })
                  .catch(error => {
                        console.log("error al traer data");
                  })
      }

      getInscriptionsBySubjectId(id_period, id_subject) {

            return new Promise((resolve, reject) => {
                  let response = null;
                  this.getInscripcionesPeriodo(id_period).then(inscriptions => {
                        console.log("inscriptions: ", inscriptions);
                        inscriptions.forEach(subject => {
                              console.log("subject: ", subject);
                              subject['TIPOS'].forEach(subject_type => {
                                    console.log("subject_type: ", subject_type);
                                    if (subject_type['CUR_CODIGO'] == id_subject) {
                                          console.log("yep");
                                          response = subject_type;
                                    }
                              })
                        });
                  })


            })
      }

}
