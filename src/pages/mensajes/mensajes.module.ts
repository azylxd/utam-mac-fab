import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MensajesPage } from './mensajes';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
   declarations: [
      MensajesPage,
   ],
   imports: [
      IonicPageModule.forChild(MensajesPage),
      PipesModule
   ],
})
export class MensajesPageModule { }
