import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
//STORAGE
import { AsignaturasProvider } from '../../providers/storage/asignaturas';

@IonicPage()
@Component({
   selector: 'page-mensaje-contactos',
   templateUrl: 'mensaje-contactos.html',
})
export class MensajeContactosPage {

   //VARIABLES PARA ALMACENAR DATA DEL STORAGE
   datos_asignaturas;

   contacto_seleccionado;

   constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private _asignaturasPrv: AsignaturasProvider,
      public viewCtrl: ViewController
   ) {
      this.contacto_seleccionado = navParams.get('cod_asignatura');
   }

   ionViewDidLoad() {
      this._asignaturasPrv.getAsignaturasData()
         .then(asignaturas => {
            this.datos_asignaturas = asignaturas;
         })
   }

   seleccionarContacto(cod_asignatura) {
      this.viewCtrl.dismiss(cod_asignatura);
   }

   salir() {
      this.viewCtrl.dismiss();
   }

}
