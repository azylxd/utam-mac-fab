import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-asignatura-evaluaciones',
    templateUrl: 'asignatura-evaluaciones.html',
})
export class AsignaturaEvaluacionesPage {

    nombre_asignatura;
    cantidad_evaluaciones;
    tipo_clase;

    //PARA ALMACENAR DATA DEL STORAGE
    datos_evaluaciones;

    //PARA SABER EL AVISO QUE DEBE MOSTRAR
    notice = 'NO_EVALUATION';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams
    ) {
        this.nombre_asignatura = navParams.get('nombre_asignatura');
        //console.log("nombre aignatura: ", this.nombre_asignatura);
        this.tipo_clase = navParams.get('tipo_clase');
        
        console.log("tipo clase: ", this.tipo_clase);
        this.datos_evaluaciones = navParams.get('evaluaciones');
        console.log("evaluaciones: ", this.datos_evaluaciones);
        this.cantidad_evaluaciones = Object.keys(this.datos_evaluaciones).length;
        //console.log("cantidad evaluacion: ", this.cantidad_evaluaciones);
    
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad AsignaturaEvaluacionesPage');
    }

}
