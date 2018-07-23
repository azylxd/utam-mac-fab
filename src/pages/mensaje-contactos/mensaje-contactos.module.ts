import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MensajeContactosPage } from './mensaje-contactos';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MensajeContactosPage,
  ],
  imports: [
    IonicPageModule.forChild(MensajeContactosPage),
    PipesModule
  ],
})
export class MensajeContactosPageModule {}
