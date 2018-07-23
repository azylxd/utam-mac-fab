import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsignaturaResumenPage } from './asignatura-resumen';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
   declarations: [
      AsignaturaResumenPage,
   ],
   imports: [
      IonicPageModule.forChild(AsignaturaResumenPage),
      PipesModule
   ],
})
export class AsignaturaResumenPageModule { }
