import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ActionSheetController, AlertController } from 'ionic-angular';
//UTILS
import { Constantes } from '../../providers/utils/constantes';
//PIPE
import { Utf8DecodePipe } from '../../pipes/utf8-decode'
//NATIVE
import { Diagnostic } from '@ionic-native/diagnostic';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { SocialSharing } from '@ionic-native/social-sharing';
//CONSTANTS
import { SERVIDOR_RECURSOS } from '../../constants/uta-api';

@IonicPage()
@Component({
   selector: 'page-asignatura-recursos',
   templateUrl: 'asignatura-recursos.html',
})
export class AsignaturaRecursosPage {

   nombre_asignatura;
   tipo_clase;

   //VARIABLES PARA ALMACENAR DATA DEL STORAGE
   datos_recursos;

   storage_directory = '';
   storage_temporal = '';

   tipos_archivos;
   url_recurso;

   notice = 'NO_RESOURCE';

   constructor(
      //COMPONENTES
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public platform: Platform,
      public actionsheetCtrl: ActionSheetController,
      public alertCtrl: AlertController,
      //NATIVE
      private diagnostic: Diagnostic,
      private fileOpener: FileOpener,
      private transfer: FileTransfer,
      private file: File,
      private socialSharing: SocialSharing,
      //PIPE
      private _utf8DecodePipe: Utf8DecodePipe,
   ) {
      this.nombre_asignatura = navParams.get('nombre_asignatura');
      this.tipo_clase = navParams.get('tipo_clase');
      this.datos_recursos = navParams.get('recursos');
      console.log("datos recursos: ", this.datos_recursos);
      this.tipos_archivos = Constantes.tiposArchivos;
      this.url_recurso = SERVIDOR_RECURSOS;

      this.platform.ready()
         .then(() => {
            if (this.platform.is('ios')) {
               this.storage_directory = this.file.documentsDirectory;
               this.storage_temporal = this.file.tempDirectory;
            }
            else if (this.platform.is('android')) {
               this.storage_directory = this.file.externalRootDirectory + 'Download/';
               this.storage_temporal = this.file.externalCacheDirectory;
            }
            else {
               return false;
            }
         });
   }

   ionViewDidLoad() {
      console.log('ionViewDidLoad AsignaturaRecursosPage');
   }


   /** 
   *Abre el menu de selección del recurso.
   */
   desplegarOpciones(recurso) {
      let title = this._utf8DecodePipe.transform(recurso.REC_DESCRIPCION);
      let actionSheet = this.actionsheetCtrl.create({
         title: title.toUpperCase(),
         buttons: [
            {
               text: 'Ver',
               icon: !this.platform.is('ios') ? 'md-eye' : null,
               handler: () => {
                  this.visualizarRecurso(recurso);
               }
            },
            {
               text: 'Descargar',
               icon: !this.platform.is('ios') ? 'md-download' : null,
               handler: () => {
                  this.descargarRecurso(recurso);
               }
            },
            {
               text: 'Compartir',
               icon: !this.platform.is('ios') ? 'md-share' : null,
               handler: () => {
                  this.compartirRecurso(recurso);
               }
            }
         ]
      });
      actionSheet.present();
   }

   /** 
   *Permite visualizar el recurso sin descargarlo.
   */
   visualizarRecurso(recurso) {

      if (recurso.REC_EXTENSION == "pdf") {
         let link = this.url_recurso + recurso.CAMINO;
         window.open(link, '_blank', 'location=yes');
      }
      else {
         this.diagnostic.requestExternalStorageAuthorization()
            .then(() => {

               this.diagnostic.isExternalStorageAuthorized()
                  .then((isAvailable) => {

                     if (isAvailable) {

                        let loader = this.loadingCtrl.create();
                        loader.present();

                        this.platform.ready()
                           .then(() => {

                              let nombre_archivo = recurso.CAMINO.split("/").pop();
                              const FileTransfer: FileTransferObject = this.transfer.create();
                              const url = this.url_recurso + recurso.CAMINO;

                              FileTransfer.download(url, this.storage_temporal + nombre_archivo)
                                 .then((entry) => {
                                    console.log('descarga completada: ' + entry.toURL());
                                    loader.dismiss();

                                    //SI EL ARCHIVO ES SOPORTADO PARA ABRIR EN EL MOVIL DOI LA OPCION DE ABRIRLO
                                    if ((recurso.REC_EXTENSION != "bpm") && (recurso.REC_EXTENSION != "psp")) {

                                       //ASIGNO UNA APLICACION COMPATIBLE PARA ABRIRLO
                                       let application = this.tipos_archivos[recurso.REC_EXTENSION];

                                       this.fileOpener.open(this.storage_temporal + nombre_archivo, application)
                                          .then(() => console.log("Archivo abierto"))
                                          .catch(e => console.log("Error al abrir"))

                                    }
                                    else { //EN CASO CONTRARIO SOLO AVIZO QUE SE DESCARGO

                                       let alert = this.alertCtrl.create({
                                          title: 'Problema al Visualizar',
                                          subTitle: 'El archivo ' + nombre_archivo + ' no puede ser visualizado en este dispositivo',
                                          buttons: [
                                             {
                                                text: 'Cerrar',
                                                role: 'cancel',
                                                handler: () => {
                                                   console.log("Cancel clicked");
                                                }
                                             }
                                          ]
                                       });
                                       alert.present();
                                    }

                                 }, (error) => {

                                    console.log(error);
                                    loader.dismiss();
                                    const alertFailure = this.alertCtrl.create({
                                       title: `Error al Abrir`,
                                       subTitle: 'Comprueba tu conexón o intentalo más tarde',
                                       buttons: ['Ok']
                                    });
                                    alertFailure.present();

                                 });

                           });
                     }

                  },
                  (error) => {
                     console.log("No hay permisos de Escritura: ", error);
                     return false;
                  })
                  .catch((error) => {
                     console.log('Error al obtener los permisos: ', error);
                     return false;
                  });

            })
            .catch(error => {
               //Handle error
            });
      }

   }

   //Permite compartir el recurso por redes sociales.
   compartirRecurso(recurso) {
      let url = 'https://docs.google.com/viewer?url=https://academico.uta.cl' + recurso.CAMINO + '&embedded=true';
      this.socialSharing.share(null, recurso.REC_DESCRIPCION, null, url);
      //ASUNTO DEL MENSAJE FUNCIONA EN: GMAIL  - NO FUNCIONA EN: WHATSAPP, MESSENGER (identificar gmail).
   }

   //ACCION PARA DESCARGAR RECURSO Y VERLO LOCALMENTE
   descargarRecurso(recurso) {

      this.diagnostic.requestExternalStorageAuthorization()
         .then(() => {

            this.diagnostic.isExternalStorageAuthorized()
               .then((isAvailable) => {

                  if (isAvailable) {

                     let loader = this.loadingCtrl.create();
                     loader.present();

                     this.platform.ready()
                        .then(() => {

                           let nombre_archivo = recurso.CAMINO.split("/").pop();
                           const FileTransfer: FileTransferObject = this.transfer.create();
                           const url = this.url_recurso + recurso.CAMINO;

                           FileTransfer.download(url, this.storage_directory + nombre_archivo)
                              .then((entry) => {
                                 console.log('descarga completada: ' + entry.toURL());
                                 loader.dismiss();

                                 //SI EL ARCHIVO ES SOPORTADO PARA ABRIR EN EL MOVIL DOI LA OPCION DE ABRIRLO
                                 if ((recurso.REC_EXTENSION != "bpm") && (recurso.REC_EXTENSION != "psp")) {

                                    //ASIGNO UNA APLICACION COMPATIBLE PARA ABRIRLO
                                    let application = this.tipos_archivos[recurso.REC_EXTENSION];
                                    let alert = this.alertCtrl.create({
                                       title: 'Descarga Completada',
                                       subTitle: 'El archivo ' + nombre_archivo + ' fue descargado en \Descargas',
                                       buttons: [
                                          {
                                             text: 'Cerrar',
                                             role: 'cancel',
                                             handler: () => {
                                                console.log("Cancel clicked");
                                             }
                                          },
                                          {
                                             text: 'Abrir',
                                             handler: () => {

                                                this.fileOpener.open(this.storage_directory + nombre_archivo, application)
                                                   .then(() => console.log("Archivo abierto"))
                                                   .catch(e => console.log("Error al abrir"))
                                             }
                                          }
                                       ]
                                    });
                                    alert.present();

                                 }
                                 else { //EN CASO CONTRARIO SOLO AVIZO QUE SE DESCARGO

                                    let alert = this.alertCtrl.create({
                                       title: 'Descarga Completada',
                                       subTitle: 'El archivo ' + nombre_archivo + ' fue descargado en \Descargas',
                                       buttons: [
                                          {
                                             text: 'Cerrar',
                                             role: 'cancel',
                                             handler: () => {
                                                console.log("Cancel clicked");
                                             }
                                          }
                                       ]
                                    });
                                    alert.present();
                                 }

                              }, (error) => {

                                 console.log(error);
                                 loader.dismiss();
                                 const alertFailure = this.alertCtrl.create({
                                    title: `Error al Descargar`,
                                    subTitle: 'Comprueba tu conexón o intentalo más tarde',
                                    buttons: ['Ok']
                                 });
                                 alertFailure.present();

                              });

                        });
                  }

               },
               (error) => {
                  console.log("No hay permisos de Escritura: ", error);
                  return false;
               })
               .catch((error) => {
                  console.log('Error al obtener los permisos: ', error);
                  return false;
               });

         })
         .catch(error => {
            //Handle error
         });

   }
}
