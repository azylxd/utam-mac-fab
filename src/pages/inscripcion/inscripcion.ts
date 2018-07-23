import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
//API PROVIDERS
import { UtaProvider } from '../../providers/API/uta';
//STORAGE PROVIDERS
import { AuthProvider } from '../../providers/storage/auth';
import { CarreraProvider } from '../../providers/storage/carrera';
import { PeriodosProvider } from '../../providers/storage/periodos';
//PLUGIN PROVIDERS
import { AlertProvider } from '../../providers/componentes/alert';
import { ToastProvider } from '../../providers/componentes/toast';
//LIBRARIES
import moment from 'moment';
//CONSTANTS
import { NOTICE } from '../../constants/images';

@IonicPage()
@Component({
  selector: 'page-inscripcion',
  templateUrl: 'inscripcion.html',
  animations: [
    trigger('animateButtonCircle', [
      state('normal', style({
        borderRadius: '5px',
        transform: 'scale(1)'
      })),
      state('circle', style({
        width: '37px',
        borderRadius: '37px'
      })),
      transition('normal => circle', animate('400ms ease-in')),
      transition('circle => normal', animate('100ms ease-in')),
    ])
  ]
})
export class InscripcionPage {
  //DATOS PERIODO QUE MANDA SERVIDOR
  year;
  semester;
  period;
  //DATOS DEL STORAGE
  id_student;
  id_career;
  //ANIMACIÓN DE BOTÓN INSCRIBIR
  status_button;
  status_label;
  //DATOS PERIODO
  is_active_period;
  info_message;
  total_inscriptions;
  datos_inscripciones;
  //CONTROL TRES NIVELES
  is_three_level;
  right_limit = 0;
  left_limit = 99;
  level_array = [];

  solicitud = [];
  codigo_respuesta_solicitud = 0;
  cargando;

  //electivo_seleccionado;
  //COUNTDOWN
  end_time;
  final_time_left = '0d.00h.00m.00s';
  //AVISO QUE DEBE MOSTRAR
  notice;

  constructor(
    private _utaPrv: UtaProvider,
    private _authPrv: AuthProvider,
    private _carreraPrv: CarreraProvider,
    private _periodosPrv: PeriodosProvider,
    public _navCtrl: NavController,
    private _toastPrv: ToastProvider,
    public _navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private alertPrv: AlertProvider
  ) {
    //this.electivo_seleccionado = _navParams.get('electivo');
  }

  ionViewDidLoad() {
    this.obtenerDatos();
  }

  getStorageIds() {
    let promises = [];
    let promise_estudiante = new Promise((resolve, reject) => {
      this._authPrv.getAuth()
        .then(response => {
          this.id_student = response;
          resolve();
        })
    });
    let promise_carrera = new Promise((resolve, reject) => {
      this._carreraPrv.getCodCarrera()
        .then(response => {
          this.id_career = response;
          resolve();
        });
    })
    promises.push(promise_estudiante);
    promises.push(promise_carrera);
    return Promise.all(promises);
  }

  obtenerDatos() {

    this.cargando = true;
    this.notice = null;
    this.getStorageIds()
      .then(() => {
        this._utaPrv.obtenerAsignaturas(this.id_student, this.id_career, 45)
          //this._utaPrv.obtenerAsignaturas(68842, 170, 45)
          .then(response => {

            console.log("response: ", response);
            if (response['cod'] == 2) {
              this.notice = {
                title: "Ha ocurrido un error",
                body: response['mensaje'],
                image: NOTICE.ERROR
              }
              setTimeout(() => this.cargando = false, 1500);
            } else {
              this.formatearData(response);
            }

          })
          .catch(error => {

            switch (error.error) {
              case 'Revise su conexión a intenet':
                this.notice = 'NO_INTERNET';
                break;
              default:
                this.notice = 'ERROR';
                break;
            }
            setTimeout(() => this.cargando = false, 1500);

            console.log("notice: ", this.notice);
            this._toastPrv.mostrarToast(error.error);
          })
      })
  }

  irDetalleElectivo(inscripcion) {

    //SI LA ASIGNATURA TIENE CUPO
    if (inscripcion.cupo != 0) {

      let validation;
      if (this.is_three_level) validation = this.levelValidation(inscripcion.nivel);

      //SI ES ASIGNATURA ELECTIVO Y NO CONFIRMADA
      if (inscripcion.caracter != 1 && inscripcion.confirmado != 1) {

        if (!this.is_three_level || (this.is_three_level && validation)) {

          let electivo_actual;
          if (inscripcion.codigo != inscripcion.cod_original) electivo_actual = inscripcion.codigo;
          let modal = this.modalCtrl.create('InscripcionElectivoPage', {
            electivos: inscripcion.asigEE,
            electivo_actual: electivo_actual
          }, { cssClass: 'modal-inscription' });

          modal.onDidDismiss(electivo => {
            if (electivo) { //SI MODAL DEVUELVE UN ELECTIVO
              if (inscripcion.codigo != electivo.codigo) { //SI ELECTIVO QUE DEVUELVE ES DISTINTO A ELECTIVO ACTUAL
                //SI HAY ELECTIVO ANTERIOR INSCRITO LO ELIMINO
                if (inscripcion.codigo != inscripcion.cod_original) {
                  this.eliminarSolicitud(inscripcion);
                }
                else { //SI NO HAY ELECTIVO INSCRITO ANTERIORMENTE
                  if (this.is_three_level) {
                    console.log("electivo => defineLimits() ");
                    this.defineLimits(inscripcion.nivel);
                  }
                }
                //ACTUALIZO NUEVOS VALORES DE INSCRIPCION
                inscripcion.inscrito = 1;
                inscripcion.nombre = electivo.nombre;

                //SI ES ELECTIVO
                if (inscripcion.caracter == 2) inscripcion.codigo = electivo.codigo;
                else { //SI ES ASIGNATURA EQUIVALENTE
                  inscripcion.asiCodigoEqui = electivo.codigo;
                  inscripcion.carreraEqui = electivo.cod;
                }
                this.insertarSolicitud(inscripcion); //INSERTO EL NUEVO ELECTIVO
              }

            }
            else if (electivo == 0) { //SI MODAL DEVUELVE NINGUNO
              if (inscripcion.codigo != inscripcion.cod_original) { //SI HAY ELECTIVO INSCRITO LO ELIMINO
                this.eliminarSolicitud(inscripcion); //ELIMINO ELECTIVO
                //RESTAURO VALORES ORIGINALES
                inscripcion.nombre = inscripcion.nombre_original;
                inscripcion.codigo = inscripcion.cod_original;
                inscripcion.inscrito = 2;

                if (this.is_three_level) this.removeLevel(inscripcion.nivel);
              }
            }
          });
          modal.present();


        }
        else {
          this.alertPrv.showAlert('Debe presentar solicitud', `Solo puede inscribir asignaturas entre los niveles ${this.left_limit} y ${this.right_limit}`);
        }

      }
      else { //SI ES ASIGNATURA O ELECTIVO CONFIRMADO
        if (inscripcion.inscrito != 1) {

          if (this.is_three_level) {
            if (validation) {
              inscripcion.inscrito = 1;
              this.defineLimits(inscripcion.nivel);
            }
            else {
              this.alertPrv.showAlert('Debe presentar solicitud', `Solo puede inscribir asignaturas entre los niveles ${this.left_limit} y ${this.right_limit}`);
            }
          }
          else inscripcion.inscrito = 1;

        }
        else {
          if (this.is_three_level) this.removeLevel(inscripcion.nivel);
          inscripcion.inscrito = 2;
        }

        if (inscripcion.inscrito == inscripcion.confirmado) {
          if (!this.is_three_level || (this.is_three_level && validation)) this.eliminarSolicitud(inscripcion);
        }
        else this.insertarSolicitud(inscripcion);
      }
    }

  }

  //68842, 170: DERECHO PARA PROBAR 3 NIVELES
  //XX: CON CARACTER 3
  inscribir() {
    // this._utaPrv.enviarSolicitud(69546,534,45,this.solicitud)
    // this._utaPrv.enviarSolicitud(83453,534,45,this.solicitud)
    // this._utaPrv.enviarSolicitud(47823, 169, 45, this.solicitud)
    this.animateCircularButton();
    //this._utaPrv.enviarSolicitud(68842, 170, 45, this.solicitud)
    this._utaPrv.enviarSolicitud(this.id_student, this.id_career, this.period, this.solicitud)
      .then(response => {
        this.left_limit = 99;
        this.right_limit = 0;
        let added = 0;
        let deleted = 0;
        let errors = [];
        this.level_array = [];
        //RECORRO EL ARRAY DE SOLICITUD LOCAL...
        this.solicitud.forEach(inscripcion => {


          let data = response['datos'].find(data => { return data.posicion == inscripcion['posicion'] });

          if (!data) deleted++;
          else if (data.inscrito == inscripcion['tipo']) { //BUSCO EN RESPUESTA SI SON IGUALES
            if (data.inscrito == 1) added++;
            else deleted++;
          }
          else {
            if (data.mensaje) {
              errors.push({
                name: data.nombre,
                message: data.mensaje
              });
            }
          }
        })

        console.log("respuesta: ", response);

        //SI SE APROBARON TODAS LAS ASIGNATURAS, SI NO SE APROBO NINGUNA O SI SE APROBARON ALGUNAS
        let popup_class;
        if (errors.length != 0) popup_class = 'inscripcion-modal-error';
        else popup_class = 'inscripcion-modal-success';

        let popup_response = this.modalCtrl.create('InscripcionPopupPage', {
          added: added,
          deleted: deleted,
          errors: errors
        }, { cssClass: popup_class });

        popup_response.onDidDismiss(() => {
          this.formatearData(response);
          this.animateNormalButton();
        });
        popup_response.present();


      })
      .catch(error => {
        this.level_array = [];
        let alert = this.alertCtrl.create({
          title: 'Ha ocurrido un error',
          message: 'Vuelve a intentarlo más tarde.',
          buttons: [
            {
              text: 'Aceptar',
              handler: () => {
                this.obtenerDatos();
              }
            }
          ]
        });
        alert.present();


        this.animateNormalButton();

      })
  }

  insertarSolicitud(inscripcion) {
    let objeto = {};
    objeto['asiCodigo'] = inscripcion.codigo;
    objeto['posicion'] = inscripcion.posicion;
    objeto['tipo'] = inscripcion.inscrito;
    objeto['caracter'] = inscripcion.caracter;
    if (inscripcion.caracter == 3) {
      objeto['carreraEqui'] = inscripcion.carreraEqui;
      objeto['asiCodigoEqui'] = inscripcion.asiCodigoEqui;
    }
    this.solicitud.push(objeto);
    console.log("solicitud(adición): ", this.solicitud);
  }

  eliminarSolicitud(inscripcion) {
    let index = this.solicitud.map(i => i.codigoAsignatura).indexOf(inscripcion.codigo); //BUSCO EL ÍNDICE DE LA SOLICITUD
    this.solicitud.splice(index, 1); //ELIMINO LA SOLICITUD
    console.log("solicitud(eliminación) ", this.solicitud);
  }

  getTimeRemaining() { //HACER UN PROVIDER O COMPONENTE DE ESTO!!!
    let now = moment().unix();
    let time_left = this.end_time - now;

    if (time_left > 0) {
      let my_timer = setInterval(() => {
        let days: any = Math.floor(time_left / 86400);
        let hours: any = Math.floor((time_left - (days * 86400)) / 3600);
        let minutes: any = Math.floor((time_left - (days * 86400) - (hours * 3600)) / 60);
        let seconds: any = Math.floor((time_left - (days * 86400) - (hours * 3600) - (minutes * 60)));
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;
        this.final_time_left = days + 'd.' + hours + 'h.' + minutes + 'm.' + seconds + 's';
        now = new Date().getTime() / 1000;
        time_left = time_left - 1;
        if (time_left <= 0) clearInterval(my_timer);
      }, 1000)
    }

  }

  formatearData(response) {
    let count_inscription = 0;

    this.solicitud = [];  //VUELVO A VACIAR CREO??
    this.info_message = response['inforAdicional'];
    this.is_active_period = response['activo'];
    this.is_three_level = response['tresnivel'];
    this.year = response['anio'];
    this.semester = response['semestre'];
    this.period = response['periodo'];
    if (this.is_active_period == 0) this.notice = 'NO_INSCRIPTION';

    response['datos'].forEach(asignatura => {

      if (asignatura.inscrito == 1) {
        asignatura.confirmado = 1;
        count_inscription++;
        if (this.is_three_level) this.defineLimits(asignatura.nivel);
      }
      else asignatura.confirmado = 2;

      if (asignatura.caracter != 1) {
        asignatura.nombre_original = asignatura.nombre;
        asignatura.cod_original = asignatura.codigo;
      }
    });
    this.datos_inscripciones = response['datos'];
    if (count_inscription == 1) this.total_inscriptions = count_inscription + ' INSCRIPCIÓN';
    else this.total_inscriptions = count_inscription + ' INSCRIPCIONES';
    this.end_time = moment(response['termino'] + ' 24:00:00', 'DD-MM-YYYY HH:mm:ss').unix();
    this.getTimeRemaining();

    setTimeout(() => this.cargando = false, 1500);
  }



  /**
   * Animación de botón de solicitud
   */
  animateCircularButton() {
    this.status_button = 'circle';
    this.status_label = 'circle';
  }

  animateNormalButton() {
    this.status_button = 'normal';
    setTimeout(() => this.status_label = 'normal', 100);
  }

  // async ionViewCanLeave() {
  //   const shouldLeave = await this.confirmLeave();
  //   return shouldLeave;
  // }

  /**
  *Para consultar si esta seguro que desea dejar la página.
  */
  confirmLeave(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    if (this.solicitud.length != 0) {
      const alert = this.alertCtrl.create({
        title: 'Hay cambios sin guardar',
        message: '¿Está seguro que desea salir sin guardar los cambios?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => resolveLeaving(false)
          },
          {
            text: 'Si',
            handler: () => resolveLeaving(true)
          }
        ]
      });
      alert.present();
    }
    else resolveLeaving(true);

    return canLeave
  }

  levelValidation(level) {
    if ((this.right_limit == 0) && (this.left_limit == 99)) return true;
    else if ((this.right_limit < level) && ((this.left_limit + 2) >= level)) return true;
    else if ((this.left_limit > level) && ((this.right_limit - 2) <= level)) return true;
    else if ((this.left_limit <= level) && (level <= this.right_limit)) return true;
    else return false;
  }

  defineLimits(level) {
    this.level_array.push(level);
    console.log("level array: ", this.level_array);
    if (this.left_limit > level) this.left_limit = level;
    if (this.right_limit < level) this.right_limit = level;
    console.log(`level: ${level} => left limit: ${this.left_limit} right limit: ${this.right_limit}`)
  }

  removeLevel(level) {
    console.log("remove level: ", level);
    let index = this.level_array.map(i => i).indexOf(level);
    this.level_array.splice(index, 1);
    console.log("level array: ", this.level_array);

    this.left_limit = 99;
    this.right_limit = 0;
    if (this.level_array.length != 0) {
      this.level_array.forEach(level => {
        //SE REPITEN LOS 2 IF EN DEFINELIMITS() (REFACTORIZAR)
        if (this.left_limit > level) this.left_limit = level;
        if (this.right_limit < level) this.right_limit = level;
      })
    }
    console.log(`new limits => left_limit: ${this.left_limit} right limit: ${this.right_limit}`);

  }

  restoreLimits() {
    this.right_limit = 0;
    this.left_limit = 99;
  }


}
