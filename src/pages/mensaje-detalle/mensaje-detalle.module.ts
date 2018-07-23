import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MensajeDetallePage } from './mensaje-detalle';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MensajeDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(MensajeDetallePage),
    PipesModule
  ],
})
export class MensajeDetallePageModule {}
