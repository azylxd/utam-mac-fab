import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides } from 'ionic-angular';
//STORAGE
import { MensajesProvider } from '../../providers/storage/mensajes';
import { AsignaturasProvider } from '../../providers/storage/asignaturas';
import { PeriodosProvider } from '../../providers/storage/periodos';
//COMPONENTES
import { ConectividadProvider } from '../../providers/componentes/conectividad_listener';
//API
import { UtaProvider } from '../../providers/API/uta';
//EXTERNAS
import moment from 'moment';

@IonicPage({
   name: 'MensajesPage',
   priority: 'high'
})
@Component({
   selector: 'page-mensajes',
   templateUrl: 'mensajes.html',
})
export class MensajesPage {
   @ViewChild(Slides) slides: Slides;

   //VARIABLES PARA ALMACENAR DATA DEL STORAGE
   datos_periodos;
   datos_asignaturas;
   datos_mensajes;
   datos_mensajes_resumen;

   //OTRAS VARIABLES
   indice_pagina = 0;
   cargando;

   constructor(
      private navCtrl: NavController,
      private _mensajesPrv: MensajesProvider,
      private _asignaturasPrv: AsignaturasProvider,
      private _periodosPrv: PeriodosProvider,
      private _conectividadPrv: ConectividadProvider,
      private _utaPrv: UtaProvider
   ) {
      this.cargando = true;
   }

   ionViewDidLoad() {
      this.obtenerDatosStorage();
      setTimeout(() => {
         if (this.datos_periodos && this.datos_periodos.length != 0) this.limitarDeslizamientoSlides()
      }, 500);
   }

   ionViewWillEnter() {

   }

   nuevoMensaje() {
      this.navCtrl.push('MensajeNuevoPage', {});
   }

   obtenerDatosStorage() {
      this._periodosPrv.getPeriodosData()
         .then((periodos: any[]) => {
            this.datos_periodos = periodos;
            console.log("periodos: ", this.datos_periodos);
         });

      this._asignaturasPrv.getAsignaturasData()
         .then((asignaturas: any[]) => {
            this.datos_asignaturas = asignaturas;
            console.log("asignaturas: ", this.datos_asignaturas);
         });

      this._mensajesPrv.getMensajesData()
         .then((mensajes: any[]) => {
            this.datos_mensajes = mensajes;
            console.log("mensajes: ", this.datos_mensajes);
         });

      this._mensajesPrv.getResumenMensajesData()
         .then((mensajes_resumen: any[]) => {
            this.datos_mensajes_resumen = mensajes_resumen;
            console.log("resumen_mensajes: ", this.datos_mensajes_resumen);
         });
   }

   cambioSlide() {
      this.indice_pagina = this.slides.getActiveIndex();
      this.limitarDeslizamientoSlides();
      //console.log("index:", this.indice_pagina);
   }

   irDetalles(cod_asignatura) {
      return this.navCtrl.push('MensajeDetallePage', {
         cod_periodo: this.datos_periodos[this.indice_pagina].PERIODO,
         asignatura: this.datos_asignaturas[cod_asignatura],
         cod_asignatura
      });
   }

   irDetallesNoLeido(index, cod_asignatura, correlativos) {
      this.irDetalles(cod_asignatura)
         .then(() => {
            //MARCO MENSAJE NO LEIDO A LEIDO (EN LA VARIABLE LOCAL "RESUMEN DE MENSAJES")
            let now = moment();
            let cod_periodo = this.datos_periodos[this.indice_pagina].PERIODO;
            this.datos_mensajes_resumen[cod_periodo]['leidos'].unshift(this.datos_mensajes_resumen[cod_periodo]['no_leidos'][index]);
            this.datos_mensajes_resumen[cod_periodo]['no_leidos'].splice(index, 1);

            //MARCO FECHA DE LECTURA DEL MENSAJE (EN LA VARIABLE LOCAL "MENSAJES")
            this.datos_mensajes[cod_periodo][cod_asignatura]
               .map(mensaje => {
                  if (!mensaje.FECHALEIDO) {
                     mensaje.FECHALEIDO = now.format("DD-MM-YYYY");
                     mensaje.HORALEIDO = now.format("HH:mm");
                  }
               });

            //MARCO LA LECTURA DEL MENSAJE EN EL STORAGE (ALMACENAMIENTO DEL NAVEGADOR/DISPOSITIVO)
            this._mensajesPrv.setMensajesData(this.datos_mensajes);
            this._mensajesPrv.setResumenMensajesData(this.datos_mensajes_resumen);
            //MARCO LA LECTURA DEL MENSAJE EN EL SERVIDOR
            this.marcarNoLeidosServidor(cod_asignatura, correlativos);
         });
   }

   marcarNoLeidosServidor(cod_asignatura, correlativos) {
      let mensaje = { cod_asignatura, correlativos };

      if (this._conectividadPrv.isConnected() == 'conectado') {
         this._utaPrv.marcarNoLeidos(cod_asignatura, correlativos)
            .catch(error => {
               this._mensajesPrv.setSincronizacionPendiente(mensaje); //DEJO LA LECTURA DE MENSAJES AL SERVIDOR PENDIENTE
            });
      }
      else {
         this._mensajesPrv.setSincronizacionPendiente(mensaje); //DEJO LA LECTURA DE MENSAJES AL SERVIDOR PENDIENTE
      }
   }

   limitarDeslizamientoSlides() {
      if (this.slides.isBeginning()) { console.log("slide inicial"); this.slides.lockSwipeToPrev(true) }
      else { this.slides.lockSwipeToPrev(false) }

      if (this.slides.isEnd()) { console.log("slide final"); this.slides.lockSwipeToNext(true) }
      else { this.slides.lockSwipeToNext(false) }
   }

}
