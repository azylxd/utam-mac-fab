import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsignaturaEvaluacionesPage } from './asignatura-evaluaciones';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AsignaturaEvaluacionesPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(AsignaturaEvaluacionesPage),
    PipesModule
  ],
})
export class AsignaturaEvaluacionesPageModule {}
