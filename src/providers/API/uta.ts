
import { Platform } from 'ionic-angular';
import { HttpClient, HttpParams, HttpHeaderResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/timeout';
import moment from 'moment';

//UTILS
import { FormateadorProvider } from '../utils/formateador';
//COMPONENTS
import { OneSignalProvider } from '../componentes/onesignal';
//STORAGE
import { AuthProvider } from '../storage/auth';
//CONSTANTS
import { UTA } from '../../constants/uta-api';

@Injectable()
export class UtaProvider {

      constructor(
            public http: HttpClient,
            public platform: Platform,
            public storage: Storage,
            private _oneSignalSrv: OneSignalProvider,
            private _authPrv: AuthProvider
      ) {
      }

      /**
      *Función para iniciar sesión (devuelve la data de la aplicación).
      */
      login(rut: string, password: string) {

            let params = new HttpParams();
            params = params.append('rut', rut);
            params = params.append('clave', password);

            return this.http.get(UTA.INICIAR_SESION, { params: params })
                  .toPromise()
                  .then(response => {
                        response = response['sesion'][0];
                        if (response['estado'] == '1') {
                              return this.obtenerDatosApp(response['idUsuario'], 1)
                        }
                        else throw response;
                  })

      }

      /**
     *Retorna los datos de usuario segun su ID - Guarda en storage fecha y hora - Parámetro acceso para indicar si es una actualizacion de datos manual
     */
      obtenerDatosApp(id_student: string, access = null): Promise<any> {
            return this._oneSignalSrv.getOneSignalId()
                  .then(onesignal_id => {

                        let params = new HttpParams();
                        params = params.append('idUsuario', id_student);
                        params = params.append('acceso', access);

                        let player_id = onesignal_id;
                        params = params.append('player_id', player_id);

                        console.log("cargando datos personales...");
                        return this.http.get(UTA.OBTENER_DATOS, { params: params })
                              .toPromise()
                              .then(response => {

                                    return this.storage.get('notification').then(data => {
                                          let last_update = moment().format("DD-MM-YYYY HH:mm");
                                          if (!data) this.storage.set('notification', []);
                                          this.storage.set('last_update', last_update);
                                          return FormateadorProvider.formatearData(response, id_student)
                                    })
                              })
                  })
      }


      /**
      *Funcion cierre de sesion - Envia los id_estudiante y id_onesignal al servidor (No permite cerrar sesion hasta que el servidor responda correctamente)
      */
      logout(id_student: string): Promise<any> {

            return this._oneSignalSrv.getOneSignalId()
                  .then(onesignal_id => {
                        let params = new HttpParams();
                        params = params.append('idUsuario', id_student);

                        let player_id = onesignal_id;
                        params = params.append('player_id', player_id);

                        return this.http.get(UTA.CERRAR_SESION, { params: params }) //SI RESPONDE CORRECTAMENTE BORRO EL STORAGE
                              .toPromise()
                              .then(response => {
                                    response = response['sesion'][0];
                                    if (response['estado'] == '1') {
                                          return response;
                                    }
                                    else {
                                          throw response;
                                    }
                              })
                  });

      }

      /**
      *Envia al servidor el ID de estudiante (unico por estudiante) y el ID de OneSignal (único por dispositivo)
      */
      enviarIDs(id_student: string) {
            return this._oneSignalSrv.getOneSignalId()
                  .then(onesignal_id => {

                        let params = new HttpParams();
                        params = params.append('idUsuario', id_student);
                        if (onesignal_id != 'cordova_not_available') {
                              let player_id = onesignal_id;
                              params = params.append('player_id', player_id);
                        }

                        return this.http.get(UTA.ENVIAR_IDS, { params: params })
                              .toPromise()
                              .then(data => {
                                    return data;
                              });
                  })
      }


      marcarNoLeidos(cur_codigo, correlativos) {
            return this._authPrv.getAuth()
                  .then(auth => {
                        let params = new HttpParams();
                        params = params.append('cur_codigo', cur_codigo);
                        params = params.append('rut', auth);
                        params = params.append('corr', correlativos);

                        return this.http.get(UTA.LEER_MENSAJE, { params: params })
                              .toPromise()
                              .then(data => {
                                    return data;
                              });
                  });
      }


      nuevoMensaje(cur_codigo, asunto, body) {
            return this._authPrv.getAuth()
                  .then(auth => {
                        let params = new HttpParams();

                        params = params.append('rut', auth);
                        params = params.append('cur_codigo', cur_codigo);
                        params = params.append('asunto', asunto);
                        params = params.append('cuerpo', body);

                        return this.http.get(UTA.ENVIAR_MENSAJE, { params: params })
                              .toPromise()
                              .then(data => {
                                    return data;
                              });
                  });
      }

      obtenerAsignaturas(id_student, id_carrer, id_period) {

            let params = new HttpParams();
            params = params.append('idUsuario', id_student);
            params = params.append('carrera', id_carrer);
            params = params.append('periodo', id_period);

            return this.http.get(UTA.OBTENER_DATOS_INSCRIPCION, { params: params })
                  .toPromise()
                  .then(data => {
                        return data;
                  })
      }

      enviarSolicitud(id_student, id_carrer, id_period, inscriptions) {

            return this._oneSignalSrv.getOneSignalId()
                  .then(onesignal_id => {

                        let params = new HttpParams();
                        inscriptions = JSON.stringify(inscriptions);

                        params = params.append('idUsuario', id_student);
                        params = params.append('carrera', id_carrer);
                        params = params.append('periodo', id_period);
                        params = params.append('inscripcion', inscriptions);
                        if (onesignal_id != 'cordova_not_available') {
                              let player_id = onesignal_id;
                              params = params.append('player_id', player_id);
                        }
                        return this.http.get(UTA.ENVIAR_INSCRIPCION, { params: params })
                              .toPromise()
                              .then(data => {
                                    return data;
                              })
                  })
      }

      sendNotification() {

            return this._oneSignalSrv.getOneSignalId()
                  .then(onesignal_id => {

                        let params = new HttpParams();
                        params = params.append('mensaje', 'Este es un mensaje de prueba');
                        params = params.append('key', 'aaa');
                        params = params.append('val', 'bbb');
                        if (onesignal_id != 'cordova_not_available') {
                              let player_id = onesignal_id;
                              params = params.append('playerId', player_id);
                        }

                        return this.http.get(UTA.SEND_NOTIFICATION, { params: params })
                              .toPromise()
                              .then(data => {
                                    console.log("response send notification: ", data);
                                    return data;
                              });
                  })
            // 'playerId=b48bd71e-65c9-4c6c-ac4c-2109e7b5fa07&mensaje=hhhhhh&key=aaa&val=bbb'
      }

}
