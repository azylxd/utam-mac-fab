import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
      selector: 'page-asignatura-asistencias',
      templateUrl: 'asignatura-asistencias.html',
})
export class AsignaturaAsistenciasPage {

      nombre_asignatura;
      tipo_clase;
      datos_asistencia;
      pct_asistencia;

      notice = 'NO_ASSISTANCE';

      constructor(
            public navCtrl: NavController,
            public navParams: NavParams
      ) {
            this.nombre_asignatura = navParams.get('nombre_asignatura');
            this.tipo_clase = navParams.get('tipo_clase');
            this.datos_asistencia = navParams.get('asistencia');
            this.pct_asistencia = navParams.get('pct_asistencia');
            console.log("datos asisntencia: ", this.datos_asistencia);
      }

      ionViewDidLoad() {

      }

      modalContenido(clase) {
            this.navCtrl.push('AsignaturaAsistenciasModalPage', { clase });
      }

}
