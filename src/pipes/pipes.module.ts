import { NgModule } from '@angular/core';
import { CapitalPipe } from './capital';
import { TiempoAtrasPipe } from './tiempo-atras';
import { TipoClasePipe } from './tipo-clase';
import { PorcentajePipe } from './porcentaje';
import { FormatoFechaPipe } from './formato-fecha';
import { KeysPipe } from './keys';
import { Utf8DecodePipe } from './utf8-decode';
import { FormatoHoraPipe } from './formato-hora';
import { SanitizeHtmlPipe } from './sanitize-html';
import { OrdenarFechaPipe } from './ordenar-fecha';


@NgModule({
  declarations: [
    CapitalPipe,
    TiempoAtrasPipe,
    TipoClasePipe,
    PorcentajePipe,
    FormatoFechaPipe,
    KeysPipe,
    Utf8DecodePipe,
    FormatoHoraPipe,
    SanitizeHtmlPipe,
    OrdenarFechaPipe,
  ],
  imports: [],
  exports: [
    CapitalPipe,
    TiempoAtrasPipe,
    TipoClasePipe,
    PorcentajePipe,
    FormatoFechaPipe,
    KeysPipe,
    Utf8DecodePipe,
    FormatoHoraPipe,
    SanitizeHtmlPipe,
    OrdenarFechaPipe,
  ]
})
export class PipesModule { }
