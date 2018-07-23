import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsignaturaAsistenciasModalPage } from './asignatura-asistencias-modal';

@NgModule({
  declarations: [
    AsignaturaAsistenciasModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AsignaturaAsistenciasModalPage),
    PipesModule
  ],
})
export class AsignaturaAsistenciasModalPageModule {}
