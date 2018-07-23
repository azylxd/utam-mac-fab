import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscripcionPopupPage } from './inscripcion-popup';

@NgModule({
  declarations: [
    InscripcionPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(InscripcionPopupPage),
  ],
})
export class InscripcionPopupPageModule {}
