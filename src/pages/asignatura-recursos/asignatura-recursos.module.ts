import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsignaturaRecursosPage } from './asignatura-recursos';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        AsignaturaRecursosPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(AsignaturaRecursosPage),
        PipesModule
    ],
})
export class AsignaturaRecursosPageModule { }
