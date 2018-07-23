import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NOTICE } from '../../constants/images';

@IonicPage()
@Component({
  selector: 'page-inscripcion-popup',
  templateUrl: 'inscripcion-popup.html',
})
export class InscripcionPopupPage {

  added;
  deleted;
  errors;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.added = navParams.get('added');
    this.deleted = navParams.get('deleted');
    this.errors = navParams.get('errors');
    console.log(`added: ${this.added} deleted: ${this.deleted}`)

    if (this.added == 1) this.added += ' ASIGNATURA INSCRITA CORRECTAMENTE.';
    else if (this.added > 1) this.added += ' ASIGNATURAS INSCRITAS CORRECTAMENTE.';

    if (this.deleted == 1) this.deleted += ' ASIGNATURA ELIMINADA CORRECTAMENTE.';
    else if (this.deleted > 1) this.deleted += ' ASIGNATURAS ELIMINADAS CORRECTAMENTE.';
  }

  ionViewDidLoad() {

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


}

//si mensaje 2: OCURRIO ALGUN error base de datos

//------
//ACTIVO: SI ESTA EN 0 ESTA INACTIVO, 1 ACTIVO. SI ACTIVO PUEDO MANIPULAR DATOS. SI ESTA INACTIVO NO PUEDO HACER ANDA
//3 NUVELES: EN 0 NO HAGO NADA, SI ESTA EN 1 VALIDO 3 NIVELES. ME INDICA DERECHO}
//ASIGNATURA
//NIVEL: MESTRE QUE PERTENICCE
//MENSAJE.: FALLO LA ISNCRIPCION.
//
