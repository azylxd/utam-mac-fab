/*
-OBTIENE 2 VECES PLAYERID, ACTUALIZAR-DATOS Y GRABAR-PLAYERID, NECESARIO REALMENTE?
-PODRÌA GUARDAR EL PLAYERID PARA EN EL STORAGE PARA MOSTRARLO EN PERFIL O CONFIGURACIÒN
*/

import { Injectable, ViewChild } from '@angular/core';
import { Platform, AlertController, ModalController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//CONSTANTS
import { APP_ID, GOOGLE_PROJECT } from '../../constants/onesignal';
//IONIC NATIVE PLUGINS
import { OneSignal } from '@ionic-native/onesignal';
//STORAGE PROVIDERS
import { NotificationsProvider } from '../storage/notification';
import { AsignaturasProvider } from '../storage/asignaturas';
import { NavigationProvider } from '../navigation/navigation';
//LIBRARIES
import moment from 'moment';



@Injectable()
export class OneSignalProvider {
      constructor(
            public platform: Platform,
            private events: Events,
            private oneSignal: OneSignal,
            private alertCtrl: AlertController, //SOLO PARA PRUEBAS
            private storage: Storage,
            private notificationsPrv: NotificationsProvider,
            private asignaturaPrv: AsignaturasProvider,
            private navigationPrv: NavigationProvider,
            public modalCtrl: ModalController
      ) { }

      iniciarOneSignal() {

            this.oneSignal.startInit(APP_ID, GOOGLE_PROJECT);
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert); //PARA?
            this.oneSignal.handleNotificationReceived().subscribe((notification) => {

                  let data = {};
                  data['body'] = notification['payload']['body'];
                  data['date'] = moment().format("DD-MM-YYYY HH:mm");
                  data['data'] = notification['payload']['additionalData'];
                  this.notificationsPrv.setNotification(data);

                  //hace algo cuando la notificacion es recibida
                  //this.updateData();
            });
            this.oneSignal.handleNotificationOpened().subscribe((data) => {

                  this.events.publish("open_notification:success", data);

                  // setTimeout(() => {
                  //       //this.navigationPrv.createNav();
                  //       //this.navigationPrv.pusho();
                  //       let modal = this.modalCtrl.create('PerfilPage');
                  //       modal.present();

                  // }, 1000);

                  console.log("abri: ", data);
                  //let data_type = data['payload']['additionalData']['type'];
                  //let data_body = data['payload']['additionalData']['body'];
                  //cod-period, cod-asig(incluye nombreAsig y tipoAsig)
                  let data_type = 'evaluacion';
                  let data_body = { cod_period: '45', cod_subject: '201810002885' };
                  let subject_data;
                  this.asignaturaPrv.getSubjectById(data_body['cod_subject'])
                        .then(result => subject_data = result);

                  //this.navigationPrv.createNav();

                  if (data_type == 'evaluacion') {
                        //this.nav.setRoot('PerfilPage');

                        //this._navCtrl.push('AsignaturaEvaluacionesPage', {
                        //nombre_asignatura: this.datos_asignatura.NOMBRE,
                        //evaluaciones: this.datos_evaluaciones[this.codigo_periodo][tipo_clase.CUR_CODIGO],
                        //tipo_clase
                        //});
                  }
                  else if (data_type == 'recurso') {

                  }
                  else if (data_type == 'mensaje') {

                  }

            });
            this.oneSignal.endInit();
      }

	/**
	*Obtiene el ID de OneSignal (único por dispositivo).
	*/
      getOneSignalId() {
            if (this.platform.is('cordova')) {
                  return this.oneSignal.getIds()
                        .then((ids) => ids.userId)
                        .catch(error => {
                              this.presentAlert('OneSignal ID', 'Error al obtener el PlayerID del dispositivo ');
                              console.log('Error al obtener OneSignalID: ', error)
                              return error;
                        });
            }
            else {
                  return new Promise((resolve, reject) => {
                        resolve(null);
                  })
            }
      }

      presentAlert(title, message) {
            let alert = this.alertCtrl.create({
                  title: title,
                  subTitle: message,
                  buttons: ['OK']
            });
            alert.present();
      }

}
