import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import moment from 'moment';
import { ScheduleProvider } from '../../providers/storage/schedule';

@IonicPage()
@Component({
    selector: 'page-horario',
    templateUrl: 'horario.html',
})
export class HorarioPage {
    dias;

    fecha_actual;
    horario_proximo;
    dias_format;

    activeSlide = 0;

    data_schedule;
    notice;

    @ViewChild(Slides) slides: Slides;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private schedulePrv: ScheduleProvider
    ) {
        this.notice = 'NO_SCHEDULE';
        this.dias_format = {
            "do": 0,
            "lu": 1,
            "ma": 2,
            "mi": 3,
            "ju": 4,
            "vi": 5,
            "sa": 6
        }

        moment.locale('es');
        this.fecha_actual = moment().format("d");
        //dd: do,lu,ma,mi,ju,vi,sá,
        //d: 0,1,2,3,4,5,6...


        //buscar el dia mas cercano
        //console.log(this.fecha_actual);

        //EJEMPLO DE JSON
        this.dias = [{
            codDia: 'lu',
            detalle: [{
                bloque: 1,
                hora: '08:00 - 09:30',
                codAsig: 'MA169',
                nomAsig: 'CALCULO I',
                sala: 'sala 101',
                ubicacion: 'Aulario C'
            }]
        },
        {
            codDia: 'ma',
            detalle: [{
                bloque: 2,
                hora: '09:40 - 11:10',
                codAsig: 'MA169',
                nomAsig: 'CALCULO I',
                sala: 'sala 101',
                ubicacion: 'Aulario C'
            }, {
                bloque: 3,
                hora: '11:20 - 12:55',
                codAsig: 'CC163',
                nomAsig: 'SISTAMES DE INFORMACION',
                sala: 'LABORATIRIO SOCOMPA',
                ubicacion: 'EDIFICIO IIUEE'
            }]
        }];
        this.obtenerHorarioProximo(this.fecha_actual);
    }

    ionViewDidLoad() {
        this.schedulePrv.getScheduleData().then(result => {
            this.data_schedule = result;
            console.log("data: ", this.data_schedule);
            let first;
            if (this.data_schedule) {
                first = Object.keys(this.data_schedule)[0];
                first = this.data_schedule[first];
                console.log("first: ", first);
            }
        })
    }

    abrirPagina(dia) {

    }

    /**
     * Obtiene el próximo horario en que el alumno tendrá clases.
     */
    obtenerHorarioProximo(fecha_actual) {
        let length_dias = this.dias.length;
        for (let i = 0; i < length_dias; i++) {
            if (fecha_actual <= this.dias_format[this.dias[i].codDia]) {
                this.horario_proximo = this.dias[i].codDia;
                console.log("dia actual", fecha_actual, "menor igual que dia horario", this.dias_format[this.dias[i].codDia]);
                i = length_dias;
            }
        }

        if (!this.horario_proximo) {
            this.horario_proximo = this.dias[0].codDia;
            console.log("proximo dia de clases:", this.horario_proximo);
        }
    }

    slideTo(index: number) {
        this.slides.slideTo(index);
        console.log("slide to: ", index);
    }

    onSlide(e) {
        this.activeSlide = this.slides.getActiveIndex();
        console.log("active slide: ", this.activeSlide);
    }

}
