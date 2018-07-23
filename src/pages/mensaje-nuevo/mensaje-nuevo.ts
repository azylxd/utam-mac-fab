import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//EXTERNAS
import moment from 'moment';
//COMPONENTES
import { ToastProvider } from '../../providers/componentes/toast';
//API
import { UtaProvider } from '../../providers/API/uta';
//STORAGE
import { MensajesProvider } from '../../providers/storage/mensajes';
import { AsignaturasProvider } from '../../providers/storage/asignaturas';

@IonicPage()
@Component({
   selector: 'page-mensaje-nuevo',
   templateUrl: 'mensaje-nuevo.html',
})
export class MensajeNuevoPage {

   mensajeForm: FormGroup;

   //VARIABLES PARA ALMACENAR DATA DEL STORAGE
   datos_asignaturas;
   datos_mensajes;
   datos_mensajes_resumen;

   cod_asignatura;
   cod_periodo;

   constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public modalCtrl: ModalController,
      private formBuilder: FormBuilder,
      private _utaPrv: UtaProvider,
      private _mensajesPrv: MensajesProvider,
      private _asignaturasPrv: AsignaturasProvider,
      private _toastPrv: ToastProvider
   ) {
      this.cod_asignatura = navParams.get('cod_asignatura');
      this.cod_periodo = navParams.get('cod_periodo');

      //console.log("cod asignatura (alternativo): ", this.cod_asignatura);

      this.mensajeForm = formBuilder.group({
         'asunto': ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
         'cuerpo': ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(500)])]
      })
   }

   ionViewDidLoad() {
      this.obtenerDatosStorage();
   }

   /**
   * Obtiene los datos desde el storage.
   */
   obtenerDatosStorage() {
      this._asignaturasPrv.getAsignaturasData()
         .then((asignaturas: any[]) => {
            this.datos_asignaturas = asignaturas;
         });

      this._mensajesPrv.getMensajesData()
         .then((mensajes: any[]) => {
            this.datos_mensajes = mensajes;
         });

      this._mensajesPrv.getResumenMensajesData()
         .then((mensajes_resumen: any[]) => {
            this.datos_mensajes_resumen = mensajes_resumen;
            console.log("datos_mensajes_resumen: ", this.datos_mensajes_resumen);
         });
   }

   enviarMensaje() {

      let asunto = this.mensajeForm.value.asunto;
      let cuerpo = this.mensajeForm.value.cuerpo;

      this._utaPrv.nuevoMensaje(this.cod_asignatura, asunto, cuerpo)
         .then(respuesta => {
            console.log("respuesta: ", respuesta);
            let fecha_actual = moment();

            //MODIFICO LAS VARIABLES DE ARRAY DE MENSAJES Y RESUMEN
            this.modificarArrayMensajes(asunto, cuerpo, fecha_actual)
            this.modificarArrayResumenMensajes(fecha_actual);

            //GUARDO LOS CAMBIOS EN EL STORAGE
            this._mensajesPrv.setResumenMensajesData(this.datos_mensajes_resumen);
            this._mensajesPrv.setMensajesData(this.datos_mensajes)
               .then(() => {
                  this.navCtrl.pop()//PASAR PARAMETRO??
                     .then(() => {
                        this._toastPrv.mostrarToast('Se ha enviado su mensaje correctamente');
                     });
               });
         })
         .catch(error => {
               console.log("error: ", error);
            this._toastPrv.mostrarToast('Error al enviar el mensaje. Intentelo más tarde.');
         });


   }

   seleccionarContacto() {
      let myModal = this.modalCtrl.create('MensajeContactosPage', { cod_asignatura: this.cod_asignatura }, { cssClass: 'modal-contacts' });


      myModal.onDidDismiss(cod_asignatura => {
         if (cod_asignatura) {
            this.cod_asignatura = cod_asignatura;
            this.cod_periodo = this.datos_asignaturas[cod_asignatura].cod_periodo;
         }
      });

      myModal.present();
   }

   modificarArrayMensajes(asunto, cuerpo, fecha_actual) {
      //CONSTUYO EL OBJETO MENSAJE
      let mensaje = {
         TITULO: asunto,
         MENSAJE: cuerpo,
         FECHAENVIO: fecha_actual.format("DD-MM-YYYY"),
         HORAENVIO: fecha_actual.format("HH:mm"),
         DESTINO: 1
      };

      //SI NO HAY MENSAJES EN EL SEMESTRE, CREO EL ARRAY PARA EL SEMESTRE, CREO EL ARRAY PARA LA ASIGNATURA E INSERTO EL MENSAJE 
      if (!this.datos_mensajes[this.cod_periodo]) {
         this.datos_mensajes[this.cod_periodo] = {};
         this.datos_mensajes[this.cod_periodo][this.cod_asignatura] = [];
         this.datos_mensajes[this.cod_periodo][this.cod_asignatura].push(mensaje);
      }

      //SI NO HAY MENSAJES EN ESA ASIGNATURA, CREO EL ARRAY PARA LA ASIGNATURA E INSERTO EL MENSAJE
      else if (!this.datos_mensajes[this.cod_periodo][this.cod_asignatura]) {
         this.datos_mensajes[this.cod_periodo][this.cod_asignatura] = [];
         this.datos_mensajes[this.cod_periodo][this.cod_asignatura].push(mensaje);
      }

      //SI YA HAY MENSAJES EN LA ASIGNATURA, INSERTO EL MENSAJE
      else {
         this.datos_mensajes[this.cod_periodo][this.cod_asignatura].push(mensaje);
      }

   }

   modificarArrayResumenMensajes(fecha_actual) {
      //CONSTRUYO EL OBJETO MENSAJE DEL RESUMEN
      let mensaje_resumen = {
         CUR_CODIGO: this.cod_asignatura,
         ULTIMO_MENSAJE: fecha_actual.format("DD-MM-YYYY") + ' ' + fecha_actual.format("HH:mm")
      };

      let leido_asignatura = false; //VARIABLE PARA VER SI LA ASIGNATURA YA TENIA UN MENSAJE LEIDO EN RESUMEN

      //BUSCO LA ASIGNATURA EN LOS MENSAJES LEIDOS DEL RESUMEN
      this.datos_mensajes_resumen[this.cod_periodo]['leidos']
         .map(resumen_asignatura => {
            //SI HAY UN MENSAJE LEIDO DE LA ASIGNATURA MODIFICO EL ELEMENTO DEL ARRAY
            if (resumen_asignatura.CUR_CODIGO == this.cod_asignatura) {
               leido_asignatura = true; //INDICA QUE TENIA UN MENSAJE LEIDO EN RESUMEN

               //MODIFICO EL OBJETO DEL ARRAY
               resumen_asignatura.CUR_CODIGO = mensaje_resumen['CUR_CODIGO'];
               resumen_asignatura.ULTIMO_MENSAJE = mensaje_resumen['ULTIMO_MENSAJE'];
            }
         });

      //SI NO HABIA UN MENSAJE LEIDO DE LA ASIGNATURA AGREGO EL NUEVO ELEMENTO AL ARRAY
      if (!leido_asignatura) {
         this.datos_mensajes_resumen[this.cod_periodo]['leidos'].unshift(mensaje_resumen);
      }

   }

}
