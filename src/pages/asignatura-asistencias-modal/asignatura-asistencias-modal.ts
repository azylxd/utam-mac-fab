import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
   selector: 'page-asignatura-asistencias-modal',
   templateUrl: 'asignatura-asistencias-modal.html',
})
export class AsignaturaAsistenciasModalPage {

   clase;

   constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public viewCtrl: ViewController
   ) {
      this.clase = navParams.get('clase');
   }

   ionViewDidLoad() {
      console.log('ionViewDidLoad AsignaturaAsistenciasModalPage');
   }

   salir() {
      this.viewCtrl.dismiss();
   }

}
