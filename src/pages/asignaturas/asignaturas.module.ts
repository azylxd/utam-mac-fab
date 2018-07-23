import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsignaturasPage } from './asignaturas';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        AsignaturasPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(AsignaturasPage),
        PipesModule
    ],
})
export class AsignaturasPageModule { }
