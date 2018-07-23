import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, Content } from 'ionic-angular';
//STORAGE
import { PersonalProvider } from '../../providers/storage/personal';
import { CarreraProvider } from '../../providers/storage/carrera';
//COMPONENTS
import { ConectividadProvider } from '../../providers/componentes/conectividad_listener';
//CONSTANTS
import { ACTION } from '../../constants/images';


@IonicPage({
   name: 'PerfilPage',
   priority: 'high'
 })
@Component({
   selector: 'page-perfil',
   templateUrl: 'perfil.html',
})
export class PerfilPage {
   @ViewChild(Content) content: Content;

   ocultar_titulo;

   //VARIABLES PARA ALMACENAR DATA DEL STORAGE
   url_foto;
   image_tap = ACTION.TAP;
   datos_personales;
   datos_carrera;

   numero_taps = 0; //VARIABLE PARA CONTAR LOS TAP

   estado_conexion = this._conectividadPrv.isConnected();

   constructor(
      public navCtrl: NavController,
      private _personalPrv: PersonalProvider,
      private _carreraPrv: CarreraProvider,
      private ref: ChangeDetectorRef,
      private _conectividadPrv: ConectividadProvider
   ) {
   }

   ionViewDidLoad() {
      this._personalPrv.getPersonalData()
         .then(personal => {
            this.datos_personales = personal;
            this.url_foto = personal.IMAGEN_ANIMADA;
         });
      this._carreraPrv.getCarreraData()
         .then(carrera => this.datos_carrera = carrera);
   }

   ionViewWillEnter() {
      this._conectividadPrv.estado_conexion
         .subscribe(value => {
            this.estado_conexion = value;
         });
   }

   /**
   *Muestra o oculta el titulo de acuerdo a la distancia top.
   */
   accionScroll() {
      let distancia_top = this.content.scrollTop;
      this.ocultar_titulo = distancia_top >= 20;
      this.ref.detectChanges();
   }

   /**
   *Cambia la foto al hacer doble tap.
   */
   accionTap() {
      this.numero_taps++;
      if (this.numero_taps % 2 == 1) {
         this.url_foto = this.datos_personales.foto;
      }
      else {
         this.url_foto = this.datos_personales.IMAGEN_ANIMADA;
      }
   }
}
