import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//UTILS
import { SERVIDOR_IMAGEN } from '../../constants/uta-api';


@IonicPage()
@Component({
   selector: 'page-asignatura-profesores',
   templateUrl: 'asignatura-profesores.html',
})
export class AsignaturaProfesoresPage {

   //VARIABLES PARA ALMACENAR DATA DEL STORAGE
   datos_asignatura;

   foto_url = SERVIDOR_IMAGEN;

   constructor(
      public navCtrl: NavController,
      public navParams: NavParams
   ) {
      this.datos_asignatura = navParams.get('asignatura');
   }

   ionViewDidLoad() {
      console.log('ionViewDidLoad AsignaturaProfesoresPage');
   }

}
