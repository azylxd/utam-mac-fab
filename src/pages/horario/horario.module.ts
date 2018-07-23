import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HorarioPage } from './horario';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    HorarioPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(HorarioPage),
  ],
})
export class HorarioPageModule {}
