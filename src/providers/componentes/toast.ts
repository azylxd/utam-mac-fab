import { Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastProvider {

   myToast;

   constructor(
      private toast: Toast,
      private platform: Platform,
      private toastCtrl: ToastController) {
   }


   mostrarToast(mensaje) {
      if (this.platform.is('cordova')) {
         //this.toast.show(mensaje, 'long', 'bottom');
         this.toast.show(mensaje, 'long', 'bottom').subscribe(
            toast => {
               console.log(toast);
            })
      }
      else {
         this.myToast = this.toastCtrl.create({
            message: mensaje,
            duration: 3000
         });
         this.myToast.present();
      }

   }

   mostrarToastOnline() {
      if (this.myToast) {
         this.myToast.dismiss();
      }
      this.myToast = this.toastCtrl.create({
         message: 'Conectado',
         duration: 3000,
         cssClass: "toast-success"
      });
      this.myToast.present();
   }

   mostrarToastOffline() {
      if (this.myToast) {
         this.myToast.dismiss();
      }
      this.myToast = this.toastCtrl.create({
         message: 'Desconectado',
         duration: 3000,
         cssClass: "toast-error"
      });
      this.myToast.present();
   }
}
