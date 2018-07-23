import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MensajeNuevoPage } from './mensaje-nuevo';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MensajeNuevoPage,
  ],
  imports: [
    IonicPageModule.forChild(MensajeNuevoPage),
    PipesModule
  ],
})
export class MensajeNuevoPageModule {}
