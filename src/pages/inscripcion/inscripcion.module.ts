import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscripcionPage } from './inscripcion';
import { ComponentsModule } from '../../components/components.module';

//import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    InscripcionPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(InscripcionPage),
    //TranslateModule.forChild()
  ],
})
export class InscripcionPageModule {}
