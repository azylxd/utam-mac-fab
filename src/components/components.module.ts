import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MyLoaderComponent } from './my-loader/my-loader';
import { MyNoticeComponent } from './my-notice/my-notice';
import { MyCardInscriptionComponent } from './my-card-inscription/my-card-inscription';
import { MyCardSubjectComponent } from './my-card-subject/my-card-subject';
import { MyCardHeaderComponent } from './my-card-header/my-card-header';
@NgModule({
    declarations: [
        MyLoaderComponent,
        MyNoticeComponent,
        MyCardInscriptionComponent,
        MyCardSubjectComponent,
        MyCardHeaderComponent
    ],
    imports: [
        IonicModule,
    ],
    exports: [
        MyLoaderComponent,
        MyNoticeComponent,
        MyCardInscriptionComponent,
        MyCardSubjectComponent,
        MyCardHeaderComponent
    ]
})
export class ComponentsModule { }
