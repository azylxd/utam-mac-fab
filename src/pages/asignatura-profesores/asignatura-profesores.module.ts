import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsignaturaProfesoresPage } from './asignatura-profesores';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
   declarations: [
      AsignaturaProfesoresPage,
   ],
   imports: [
      IonicPageModule.forChild(AsignaturaProfesoresPage),
      PipesModule
   ],
})
export class AsignaturaProfesoresPageModule { }
