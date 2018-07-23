import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//STORAGE
import { EvaluacionesProvider } from '../../providers/storage/evaluaciones';
import { AsistenciasProvider } from '../../providers/storage/asistencias';
import { RecursosProvider } from '../../providers/storage/recursos';

@IonicPage()
@Component({
      selector: 'page-asignatura-resumen',
      templateUrl: 'asignatura-resumen.html',
})
export class AsignaturaResumenPage {

      //VARIABLES PARA ALMACENAR DATA DEL STORAGE
      datos_asignatura;
      datos_asistencias;
      datos_recursos;
      datos_evaluaciones;

      codigo_periodo;

      constructor(
            public navCtrl: NavController,
            public navParams: NavParams,
            private _evaluacionesPrv: EvaluacionesProvider,
            private _asistenciaPrv: AsistenciasProvider,
            private _recursosPrv: RecursosProvider
      ) {
            this.datos_asignatura = navParams.get('asignatura');
            //console.log("datos asignaturas: ", this.datos_asignatura);
            this.codigo_periodo = navParams.get('codigo_periodo');
            //console.log("codigo periodo: ", this.codigo_periodo);
      }

      ionViewDidLoad() {
            this._evaluacionesPrv.getAllEvaluations()
                  .then((evaluaciones: any[]) => {
                        this.datos_evaluaciones = evaluaciones;
                        console.log("Evaluaciones[]: ", this.datos_evaluaciones);
                  });

            this._asistenciaPrv.getAsistenciasData()
                  .then((asistencias: any[]) => {
                        this.datos_asistencias = asistencias;
                        console.log("Asistencias[]: ", this.datos_asistencias);
                  });

            this._recursosPrv.getRecursosData()
                  .then((recursos: any[]) => {
                        this.datos_recursos = recursos;
                        console.log("Recursos[]: ", this.datos_recursos);
                  });
      }

      irProfesores(asignatura) {
            this.navCtrl.push('AsignaturaProfesoresPage', { asignatura });
      }

      irEvaluaciones(tipo_clase) {
            this.navCtrl.push('AsignaturaEvaluacionesPage', {
                  nombre_asignatura: this.datos_asignatura.NOMBRE,
                  evaluaciones: this.datos_evaluaciones[this.codigo_periodo][tipo_clase.CUR_CODIGO],
                  tipo_clase
            });
      }

      irRecursos(tipo_clase) {
            console.log("tipo clas: ", tipo_clase)
            console.log("datos: ", this.datos_recursos[this.codigo_periodo][tipo_clase.CUR_CODIGO])
            this.navCtrl.push('AsignaturaRecursosPage', {
                  nombre_asignatura: this.datos_asignatura.NOMBRE,
                  recursos: this.datos_recursos[this.codigo_periodo][tipo_clase.CUR_CODIGO],
                  tipo_clase
            });
      }

      irAsistencias(tipo_clase) {

            this.navCtrl.push('AsignaturaAsistenciasPage', {
                  nombre_asignatura: this.datos_asignatura.NOMBRE,
                  asistencia: this.datos_asistencias[this.codigo_periodo][tipo_clase.CUR_CODIGO]['clases'],
                  pct_asistencia: this.datos_asistencias[this.codigo_periodo][tipo_clase.CUR_CODIGO]['porcentaje'],
                  tipo_clase
            });
      }

}
