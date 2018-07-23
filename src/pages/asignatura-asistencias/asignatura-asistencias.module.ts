import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsignaturaAsistenciasPage } from './asignatura-asistencias';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        AsignaturaAsistenciasPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(AsignaturaAsistenciasPage),
        PipesModule
    ],
})
export class AsignaturaAsistenciasPageModule { }
