import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
//NATIVE PLUGIN
import { Network } from '@ionic-native/network';

declare var navigator;

@Injectable()
export class ConectividadProvider {

      //VARIABLE OBSERVABLE DINÁMICA
      estado_conexion: any = new Subject<string>();
      //VARIABLES DE ESTILO CSS
      estilo_conectado = 'conectado';
      estilo_desconectado = 'desconectado';
      //VARIABLE PARA SABER SI ESTOY EN UN CELULAR O NAVEGADOR
      device: boolean;

      constructor(
            private network: Network,
            private platform: Platform,
      ) {
            this.device = this.platform.is('cordova');

            this.listenerDesconectado();
            this.listenerConectado();
      }

      isConnected() {
            if (this.device && this.network.type) {
                  return (this.network.type != ('none' || 'unknown')) ? this.estilo_conectado : this.estilo_desconectado;
            }
            else {
                  return (navigator.onLine) ? this.estilo_conectado : this.estilo_desconectado;
            }
      }

      listenerConectado() {
            return this.network.onConnect()
                  .subscribe(() => {
                        //this.estado_conexion = this.estilo_conectado;
                        this.estado_conexion.next(this.estilo_conectado);
                  })
      }

      listenerDesconectado() {
            return this.network.onDisconnect()
                  .subscribe(() => {
                        //this.estado_conexion = this.estilo_desconectado;
                        this.estado_conexion.next(this.estilo_desconectado);
                  })
      }

}
