
import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, Events, MenuController } from 'ionic-angular';

import 'rxjs/add/operator/timeout';
import { TimerObservable } from "rxjs/observable/TimerObservable";

//UTILS
import { RutProvider } from '../../providers/utils/rut';
import { Base64Provider } from '../../providers/utils/base64';
import { StorageProvider } from '../../providers/storage/storage';
//API
import { UtaProvider } from '../../providers/API/uta';
//NATIVE
import { ToastProvider } from '../../providers/componentes/toast';
import { Keyboard } from '@ionic-native/keyboard';
import { ConectividadProvider } from '../../providers/componentes/conectividad_listener';

import { LOGO, LOGIN_BACKGROUND } from '../../constants/images';

@IonicPage()
@Component({
      selector: 'page-login',
      templateUrl: 'login.html',
      animations: [
            trigger('animacionBotonCirculo', [
                  state('normal', style({
                        borderRadius: '5px',
                        transform: 'scale(1)'
                  })),
                  state('circulo', style({
                        width: '47px',
                        borderRadius: '47px'
                  })),
                  transition('normal => circulo', animate('500ms ease-in')),
                  transition('circulo => normal', animate('100ms ease-in')),
            ])
      ]
})
export class LoginPage {

      img_logo = LOGO;
      img_background = LOGIN_BACKGROUND;
      estado_boton = 'normal';
      estado_label;

      private loginForm: FormGroup;

      constructor(
            private _conectividadPrv: ConectividadProvider,
            public navCtrl: NavController,
            private formBuilder: FormBuilder,
            private events: Events,
            private _rutPrv: RutProvider,
            private _utaPrv: UtaProvider,
            private _base64Prv: Base64Provider,
            private _toastPrv: ToastProvider,
            private _storagePrv: StorageProvider,
            private menuCtrl: MenuController,
            private keyboard: Keyboard
      ) {
            this.loginForm = formBuilder.group({
                  rut: ["", Validators.compose([Validators.required])],
                  contrasena: ["", Validators.compose([Validators.minLength(4)])]
            });

            this.keyboard.onKeyboardShow().subscribe(() => {
                  document.body.classList.add('teclado-abierto');
            });

            this.keyboard.onKeyboardHide().subscribe(() => {
                  document.body.classList.remove('teclado-abierto');
            });
      }

      ionViewDidEnter() {
            //HACK PARA NO OCULTAR EL BOTÓN MENU ANTES DE TIEMPO AL CERRAR LA SESIÓN E IR AL LOGIN
            let menu = this.menuCtrl;
            setTimeout(() => {
                  menu.enable(false);
            }, 1000);
      }

      login() {

            let rut_invalido = this._rutPrv.verificarRut(this.loginForm.value.rut);
            if (!rut_invalido) {

                  if (this._conectividadPrv.isConnected() == 'conectado') {
                        this.animacionBotonCirculo();
                  }

                  return this._utaPrv.login(this._rutPrv.soloRUT(this.loginForm.value.rut), this._base64Prv.encode(this.loginForm.value.contrasena))
                        .then(data => {
                              return this._storagePrv.almacenarDatos(data)
                                    .then(() => {
                                          this.events.publish("login:success", data);
                                    })
                        })
                        .catch(error => {
                              this.animacionBotonNormal();
                              console.log("entre: ", error);
                              //Error al conectarse. Revise su conexión a internet.

                              switch (error.error) {  //DEPENDIENDO DEL ERROR LO MUESTRA EN UN TOAST
                                    case 408:
                                          error.error = "Tiempo de espera agotado."
                                          break;
                                    case "Usuario no se encuentra registrado.":
                                          error.error = "Usuario no registrado."
                                          this.loginForm.controls.rut.setErrors({ rut_not_register: true });
                                          break;
                                    case "Clave no valida.":
                                          error.error = "Contraseña no válida."
                                          this.loginForm.controls.contrasena.setErrors({ wrong_pass: true });
                                          break;
                                    default:
                                          //error.error = "Revise su conexión a internet."
                                          break;
                              }
                              this._toastPrv.mostrarToast(error.error);

                        })
            }
            else {

                  switch (rut_invalido) {
                        case "RUT incompleto.":
                              this.loginForm.controls.rut.setErrors({ rut_incomplete: true });
                              break;
                        case "RUT no válido.":
                              this.loginForm.controls.rut.setErrors({ rut_invalid: true });
                              break;
                  }
                  this.animacionBotonNormal();
                  this._toastPrv.mostrarToast(rut_invalido);
            }

      }

      /**
      *Evento Input: No deja ingresar valores no permitidos en el input.
      */
      digitosValidosRut() {
            let rut = this._rutPrv.digitosValidosRut(this.loginForm.value.rut);
            this.loginForm.controls['rut'].setValue(rut); //INSERTO EL RUT LIMPIO EN EL INPUT
      }

      /**
      *Evento Focus: Al presionar el input saca todos los puntos y el guion del formato RUT: 18.313.961-4 => 183139614
      */
      limpiarRut() {
            let rut = this._rutPrv.limpiarRut(this.loginForm.value.rut);
            this.loginForm.controls['rut'].setValue(rut); //INSERTO EL RUT LIMPIO EN EL INPUT
      }

      /**
      *Evento Blur: Al salir del input formatea el RUT: 183139614 => 18.313.961-4
      */
      formatearRut() {
            let rut = this._rutPrv.formatearRut(this.loginForm.value.rut);
            this.loginForm.controls['rut'].setValue(rut); //INSERTO EL RUT FORMATEADO EN EL INPUT
      }

      animacionBotonNormal() {
            this.estado_boton = 'normal';
            setTimeout(() => this.estado_label = 'normal', 100);
      }

      animacionBotonCirculo() {
            this.estado_boton = 'circulo';
            this.estado_label = 'circulo';
      }

}
