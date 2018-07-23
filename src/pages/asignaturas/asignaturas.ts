import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides } from 'ionic-angular';
//STORAGE
import { PeriodosProvider } from '../../providers/storage/periodos';
import { InscripcionesProvider } from '../../providers/storage/inscripciones';
import { EvaluacionesProvider } from '../../providers/storage/evaluaciones';

@IonicPage()
@Component({
   selector: 'page-asignaturas',
   templateUrl: 'asignaturas.html',
})
export class AsignaturasPage {
   @ViewChild(Slides) slides: Slides;

   //VARIABLES PARA ALMACENAR DATA DEL STORAGE
   datos_periodos;
   datos_evaluaciones;
   datos_inscripciones;

   indice_pagina = 0;

   constructor(
      private _navCtrl: NavController,
      private _periodosPrv: PeriodosProvider,
      private _inscripcionesPrv: InscripcionesProvider,
      private _evaluacionesPrv: EvaluacionesProvider
   ) {
   }

   ionViewDidLoad() {

      this._periodosPrv.getPeriodosData()
         .then((periodos: any[]) => {
            this.datos_periodos = periodos;
            //console.log("Periodos: ", this.datos_periodos);
         });

      this._inscripcionesPrv.getInscripcionesData()
         .then((inscripciones: any[]) => {
            this.datos_inscripciones = inscripciones;
            //console.log("Inscripciones: ", this.datos_inscripciones);
         });

      this._evaluacionesPrv.getAllEvaluations()
         .then((evaluaciones: any[]) => {
            this.datos_evaluaciones = evaluaciones;
            //console.log("Evaluacioness: ", this.datos_evaluaciones);
         });

      setTimeout(() => {
         if (this.datos_periodos && this.datos_periodos.length != 0) this.limitarDeslizamientoSlides()
      }, 500);

   }

   ionViewWillEnter() {
   }


   cambioSlide() {
      this.indice_pagina = this.slides.getActiveIndex();
      this.limitarDeslizamientoSlides();
      //console.log("index:", this.indice_pagina);
   }

   limitarDeslizamientoSlides() {
      if (this.slides.isBeginning()) { this.slides.lockSwipeToPrev(true) }
      else { this.slides.lockSwipeToPrev(false) }

      if (this.slides.isEnd()) { this.slides.lockSwipeToNext(true) }
      else { this.slides.lockSwipeToNext(false) }
   }

   irResumenAsignatura(asignatura) {
      this._navCtrl.push('AsignaturaResumenPage', {
         codigo_periodo: this.datos_periodos[this.indice_pagina].PERIODO,
         asignatura
      });
   }

}
