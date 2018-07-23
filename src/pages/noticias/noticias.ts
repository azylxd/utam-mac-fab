import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, LoadingController, Content, Events, App } from 'ionic-angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
//STORAGE
import { NoticiasProvider } from './../../providers/storage/noticias';
//EXTERNAS
import moment from 'moment';
import { UtaProvider } from '../../providers/API/uta';
import { AsignaturasProvider } from '../../providers/storage/asignaturas';
import { NavigationProvider } from '../../providers/navigation/navigation';
import { InscripcionesProvider } from '../../providers/storage/inscripciones';

@IonicPage({
  name: 'NoticiasPage',
  priority: 'high'
})
@Component({
  selector: 'page-noticias',
  templateUrl: 'noticias.html',
  animations: [
    trigger('rotate', [
      state('true', style({ transform: 'rotate(0)' })),
      state('false', style({ transform: 'rotate(180deg)' })),
      transition('false => true', animate('400ms ease-out')),
      transition('true => false', animate('400ms ease-in'))
    ])
  ]
})

export class NoticiasPage {
  @ViewChild(Content) content: Content;

  ocultar_titulo;
  fecha_actual;
  subject_data;

  //VARIABLES PARA ALMACENAR DATA DEL STORAGE
  datos_noticias;
  cargando;

  notice = 'NO_NEWS';
  constructor(
    private loadingCtrl: LoadingController,
    private _noticiasPrv: NoticiasProvider,
    private ref: ChangeDetectorRef,
    private _utaPrv: UtaProvider,
    private asignaturaPrv: AsignaturasProvider,
    private navigationPrv: NavigationProvider,
    private events: Events,
    private app: App,
    private inscriptionPrv: InscripcionesProvider
  ) {
    moment.locale('es');
    this.fecha_actual = moment().format("dddd, DD [de] MMMM");
    this.cargando = true;
  }

  ionViewDidLoad() {
    let data_body = { cod_period: '45', cod_subject: '201810002885' };
    this.asignaturaPrv.getSubjectById(data_body['cod_subject'])
      .then(result => {
        let asig = result;
        //console.log("asig: ", asig);
      })
    //console.log("asig: ", asig);
    this.cargando = true;
    /*let loader = this.loadingCtrl.create({
       content: "Cargando",
    });*/

    //OTRO SPINNER
    //https://codepen.io/mavrK/pen/RKrVdm
    //https://codepen.io/dineshdesign/pen/BzOBYg
    //http://tobiasahlin.com/spinkit/
    this._noticiasPrv.getNoticiasData()
      .then(data => {
        data.forEach(noticia => {
          noticia.estado = 'noticia-contraida';
          noticia.activo = false;
        });
        this.datos_noticias = data;
        this.cargando = false;
      });
  }

  /** 
  *Abre o cierra la noticia seleccionada.
  */
  accionNoticia(index) {
    if (!this.datos_noticias[index].estado) { //CIERRO LA MISMA NOTICIA
      this.datos_noticias[index].activo = false;
      this.datos_noticias[index].estado = 'noticia-contraida'; //CIERRO NOTICIA SELECCIONADA (AGREGO ESTILO PARA CONTRAER)
    }
    else {
      this.datos_noticias[index].activo = true;
      this.datos_noticias[index].estado = null; //ABRO NOTICIA SELECCIONADA (DEJO SIN ESTILO LA NOTICIA)
    }
  }

  /**
  *Muestra o oculta el titulo de acuerdo a la distancia top.
  */
  accionScroll() {
    let distancia_top = this.content.scrollTop;
    this.ocultar_titulo = distancia_top >= 20;
    this.ref.detectChanges(); //FUNCION QUE PERMITE DETECTAR LOS CAMBIOS EN EL SCROLL
  }

  sendNotification() {
    console.log("sending notificacion...");
    this._utaPrv.sendNotification()
      .then(() => {
        console.log("se soluciono el error?")
      })
  }

  rootProfile() {
    //this.navigationPrv.createNav();
    //let aa = this.app.getActiveNavs()[0].push('PerfilPage')
    //console.log("aa: ", aa);
    console.log(this.inscriptionPrv.getInscriptionsBySubjectId("45", "201810004709"));
    
  }
}
