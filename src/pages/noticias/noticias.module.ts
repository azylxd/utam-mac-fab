import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticiasPage } from './noticias';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    NoticiasPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(NoticiasPage),
    PipesModule
  ],
})
export class NoticiasPageModule {}
