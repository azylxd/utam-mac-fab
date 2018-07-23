import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//STORAGE
import { MensajesProvider } from '../../providers/storage/mensajes';

@IonicPage()
@Component({
   selector: 'page-mensaje-detalle',
   templateUrl: 'mensaje-detalle.html',
})
export class MensajeDetallePage {

   cod_periodo;
   cod_asignatura;

   //VARIABLES PARA ALMACENAR DATA DEL STORAGE
   datos_mensajes;
   datos_asignatura;

   constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private _mensajesPrv: MensajesProvider
   ) {
      this.cod_periodo = navParams.get('cod_periodo');
      this.cod_asignatura = navParams.get('cod_asignatura');
      this.datos_asignatura = navParams.get('asignatura');
   }

   ionViewDidLoad() {
      this._mensajesPrv.getMensajesAsignatura(this.cod_periodo, this.cod_asignatura)
         .then(mensajes => {
            this.datos_mensajes = mensajes;
         });
   }

   nuevoMensaje(cod_asignatura) {
      this.navCtrl.push('MensajeNuevoPage', {
         cod_periodo: this.cod_periodo,
         cod_asignatura
      });
   }

}
