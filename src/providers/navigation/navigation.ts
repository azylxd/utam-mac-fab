import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { EvaluacionesProvider } from '../storage/evaluaciones';

@Injectable()
export class NavigationProvider {

  pagesToPush: any[];

  constructor(
    public app: App,
    private evaluacionesPrv: EvaluacionesProvider,
 
  ) { }

  createNav(data?) {

    let tipo_clase = {
      CUR_CODIGO: "201810004709",
      DOCENTES: [
        { NOMBRE: "RAUL", EMAIL: "", FOTO: "" }
      ],
      GRUPO: "A",
      TIPO: "T"
    };
    this.pagesToPush = [];
    // if(data.notification.payload.additionalData.type == 'evaluacion'){
    //   this.pagesToPush.push({
    //     page: ''
    //   })
    // }

    //this.app.getRootNav().setRoot('PerfilPage')
    //this.app.getActiveNavs()[0].setRoot('PerfilPage');
    let ev;
    this.evaluacionesPrv.getEvaluationsBySubject("45", "201810004709").then(response => {
      ev = response;

      
      this.app.getRootNavs()[0].setRoot('AsignaturaEvaluacionesPage', {
        nombre_asignatura: 'QUIMICA',
        tipo_clase: tipo_clase,
        evaluaciones: ev
      });
    })

  }

  pusho() {
    this.app.getActiveNavs()[0].push('PerfilPage')
  }
}
