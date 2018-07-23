import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscripcionElectivoPage } from './inscripcion-electivo';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    InscripcionElectivoPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(InscripcionElectivoPage),
  ],
})
export class InscripcionElectivoPageModule {}
