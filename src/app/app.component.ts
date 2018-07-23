import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, MenuController } from 'ionic-angular';

// API PROVIDER
import { UtaProvider } from '../providers/API/uta';
// IONIC NATIVE PLUGINS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// STORAGE PROVIDERS
import { AuthProvider } from '../providers/storage/auth';
import { MensajesProvider } from './../providers/storage/mensajes';
import { PersonalProvider } from './../providers/storage/personal';
import { StorageProvider } from './../providers/storage/storage';
// COMPONENT PROVIDERS
import { AlertProvider } from './../providers/componentes/alert';
import { ConectividadProvider } from '../providers/componentes/conectividad_listener';
import { OneSignalProvider } from './../providers/componentes/onesignal';
import { ToastProvider } from './../providers/componentes/toast';
import { DeviceProvider } from '../providers/componentes/device';


@Component({
      templateUrl: 'app.html'
})
export class MyApp {
      @ViewChild(Nav) nav: Nav;

      device_info: string = 'NO DISPONIBLE';
      status_footer;
      count_taps = 0;

      estado_conexion;
      datos_aplicacion;
      datos_personales;
      url_foto;

      rootPage: any;
      pages;

      constructor(
            private events: Events,
            private menuCtrl: MenuController,
            private loadingCtrl: LoadingController,
            public platform: Platform,
            public statusBar: StatusBar,
            private splashScreen: SplashScreen,
            private _conectividadPrv: ConectividadProvider,
            private _toastPrv: ToastProvider,
            private _authPrv: AuthProvider,
            private _utaPrv: UtaProvider,
            private _personalPrv: PersonalProvider,
            private _storagePrv: StorageProvider,
            private _alertPrv: AlertProvider,
            private _oneSignalPrv: OneSignalProvider,
            private _mensajesPrv: MensajesProvider,
            private devicePrv: DeviceProvider,
      ) {
            this.initializeApp();

            this.pages = [
                  { title: 'Noticias', component: 'NoticiasPage', icon: 'my-news', css: '2.45rem' },
                  { title: 'Perfil', component: 'PerfilPage', icon: 'my-account', css: '2.8rem' },
                  //{ title: 'Notificaciones', component: 'NotificationsPage', icon: 'my-bell', css: '2.5rem' },
                  { title: 'Mensajes', component: 'MensajesPage', icon: 'my-email', css: '2.3rem' },
                  { title: 'Inscripción', component: 'InscripcionPage', icon: 'my-lead-pencil', css: '2.4rem' },
                  { title: 'Asignaturas', component: 'AsignaturasPage', icon: 'my-cards', css: '2.4rem' },
                  //{ title: 'Horario', component: 'HorarioPage', icon: 'md-calendar', css: '2.7rem' }
            ];

            this.estado_conexion = this._conectividadPrv.isConnected();
            //FUNCIÓN QUE DETECTA LOS CAMBIOS DE LA VARIABLE DE CONEXION QUE ESTA EN EL SERVICIO NETWORK
            this._conectividadPrv.estado_conexion
                  .subscribe(value => {
                        this.estado_conexion = value;
                        if (value == 'conectado') {
                              if (this.datos_personales) this._toastPrv.mostrarToastOnline();
                              this.sincronizarCierreSesion(); //SINCRONIZO CIERRE SESION
                              this.sincronizarMensajes(); //SINCRONIZO MENSAJES
                        }
                        else {
                              if (this.datos_personales) this._toastPrv.mostrarToastOffline();
                        }
                  });

            // LISTENER
            this.events.subscribe("login:success", respuesta => this.onLogin(respuesta.personal));
            this.events.subscribe("open_notification:success", respuesta => this.updateData());
      }


      initializeApp() {

            this.comprobarSesion();
            this.platform.ready()
                  .then((response) => {
                        let self = this;
                        if (response == 'cordova') {
                              this.statusBar.styleLightContent();
                              //this.statusBar.styleDefault(); windows
                              this._oneSignalPrv.iniciarOneSignal();
                              this.device_info = this.devicePrv.getDeviceInfo();
                        }
                  });
      }

      abrirPagina(pagina) {
            this.nav.setRoot(pagina.component);
      }

      comprobarSesion() {
            this._personalPrv.getPersonalData()
                  .then(data => {

                        if (data) {
                              this.datos_personales = data;
                              this.url_foto = data.IMAGEN_ANIMADA;

                              this._utaPrv.obtenerDatosApp(this.datos_personales.PER_ID)
                                    .then(respuesta => {
                                          this._storagePrv.almacenarDatos(respuesta)
                                                .then(() => {
                                                      this.hideSplash();
                                                      //loader.dismiss();
                                                });
                                    })
                                    .catch(error => {
                                          console.log("error 2: ", error);
                                          this.hideSplash();
                                          //loader.dismiss();
                                          this._toastPrv.mostrarToast("Error al actualizar los datos de la aplicación");

                                    });

                              this.menuCtrl.enable(true);
                              this.rootPage = 'NoticiasPage';

                        }
                        else {
                              this.hideSplash();
                              this.rootPage = 'LoginPage';
                        }

                  });
      }

      /**
      *Actualiza los datos de la aplicación.
      */
      actualizarDatos() {
            let loader = this.loadingCtrl.create();
            loader.present();
            this._authPrv.getAuth()
                  .then(response => {
                        let id_estudiante = JSON.stringify(response).replace(/\"/g, "");
                        let acceso = 1;

                        this._utaPrv.obtenerDatosApp(id_estudiante, acceso)
                              .then(response => {
                                    return this._storagePrv.almacenarDatos(response)
                                          .then(() => {
                                                loader.dismiss();
                                          });
                              })
                              .catch(error => {
                                    loader.dismiss();
                                    error.error = "Error al actualizar datos. Compruebe su conexión a internet";
                                    this._alertPrv.showAlert("Actualizar Datos", error.error);
                              })
                  });
      }

      /**
      *Función para cerrar la sesion en el dispositivo.
      */
      logout() {

            let loader = this.loadingCtrl.create({ content: "Cerrando Sesion" });
            loader.present();

            this._authPrv.getAuth()
                  .then(data => {
                        let id_estudiante = JSON.stringify(data).replace(/\"/g, "");

                        if (this.estado_conexion == 'conectado') {

                              this._utaPrv.logout(id_estudiante)
                                    .catch(() => {
                                          if (id_estudiante) {
                                                this._authPrv.setSincronizacionLogout(id_estudiante);
                                          }
                                    })
                        }
                        else {
                              if (id_estudiante) {
                                    this._authPrv.setSincronizacionLogout(id_estudiante);
                              }
                        }
                        loader.dismiss();
                        this.datos_personales = null;
                        this.nav.setRoot('LoginPage');
                        this._storagePrv.eliminarDatos();
                  })
      }

      /**
      *Funcion que se ejecuta posterior al login.
      */
      onLogin(data) {
            this._utaPrv.enviarIDs(data.PER_ID)
                  .catch(() => {
                        this._authPrv.setSincronizacionEnvioIds(data.PER_ID);
                  });

            this.datos_personales = data;
            this.url_foto = data.IMAGEN_ANIMADA;
            this.menuCtrl.enable(true);
            this.nav.setRoot('NoticiasPage');
      }

      sincronizarCierreSesion() {
            let aun_pendientes = [];
            let promises = [];

            return this._authPrv.getSincronizacionLogout()
                  .then(logouts_pendientes => {
                        logouts_pendientes.forEach(logout => {
                              promises.push(this._utaPrv.logout(logout)
                                    .catch(() => {
                                          aun_pendientes.push(logout);
                                    }))
                        });
                        return Promise.all(promises);
                  })
                  .then(() => {
                        this._authPrv.setSincronizacionLogout(aun_pendientes, true);
                  })
      }

      sincronizarMensajes() {
            let aun_pendientes = [];
            let promises = [];

            return this._mensajesPrv.getSincronizacionLecturaMensajes()
                  .then(mensajes_pendientes => {
                        mensajes_pendientes.forEach(mensaje => {
                              promises.push(this._utaPrv.marcarNoLeidos(mensaje.cur_codigo, mensaje.correlativos)
                                    .catch(() => {
                                          aun_pendientes.push(mensaje);
                                    }))
                        });
                        return Promise.all(promises);
                  })
                  .then(() => {
                        this._mensajesPrv.setSincronizacionPendiente(aun_pendientes, true);
                  })
      }


      /**
       * Función para sincronizar el envio de IDs al servidor. Ejemplo: Cuando alguien cierra sesión sin conexión a internet, en algun otro momento cuando la app tenga conexión a internet se debe enviar el ID de Onesignal al servidor para que este deje de enviar notificaciones de ese estudiante que ya cerro sesión.
       */
      sincronizarEnvioIds() {
            let aun_pendientes = [];
            let promises = [];

            return this._authPrv.getSincronizacionEnvioIds()
                  .then(conjunto_pendientes => {
                        conjunto_pendientes.forEach(envio_id => {
                              promises.push(this._utaPrv.enviarIDs(envio_id)
                                    .catch(() => {
                                          aun_pendientes.push(envio_id);
                                    }))
                        });
                        return Promise.all(promises);
                  })
                  .then(() => {
                        this._authPrv.setSincronizacionEnvioIds(aun_pendientes, true);
                  })
      }


      /**
       * Función para esconder el splash manualmente con retraso. Necesario esconder el splash con retraso para asegurarse que los elementos hallan sido reenderizados correctamente.
       */
      hideSplash() {
            if (this.platform.is('cordova')) {
                  let splash = this.splashScreen;
                  setTimeout(() => {
                        splash.hide();
                  }, 1000);
            }
      }

      // MUESTRA INFO DEL DISPOSITIVO AL HACER 5 TAPS
      showDeviceInfo() {
            this.count_taps++;
            if (this.count_taps % 5 == 0) this.status_footer = !this.status_footer;
      }

      updateData(first_time?: boolean) {


           
            if (this.datos_personales) {
                  let loader = this.loadingCtrl.create({
                        content: 'Actualizando Datos...'
                  });
                  loader.present();
                  this._utaPrv.obtenerDatosApp(this.datos_personales.PER_ID)
                        .then(respuesta => {
                              this._storagePrv.almacenarDatos(respuesta)
                                    .then(() => {
                                          loader.dismiss();
                                    });
                        })
                        .catch(error => {
                              console.log("error 2: ", error);
                              loader.dismiss();
                              this._toastPrv.mostrarToast("Error al actualizar los datos de la aplicación");
                        });
            }
            else{

            }
      }


}
