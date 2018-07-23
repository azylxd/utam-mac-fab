import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-inscripcion-electivo',
  templateUrl: 'inscripcion-electivo.html',
})
export class InscripcionElectivoPage {

  electivo_actual;
  datos_electivos;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.electivo_actual = navParams.get('electivo_actual');
    this.datos_electivos = navParams.get('electivos');
    console.log("electivos disponibles: ", this.datos_electivos);
    console.log("electivo actual: ", this.electivo_actual);
  }

  ionViewDidLoad() { }

  seleccionar(electivo?) {
    if (electivo) this.viewCtrl.dismiss(electivo);
    else this.viewCtrl.dismiss(0);
  }

  cerrar() {
    this.viewCtrl.dismiss();
  }

}
