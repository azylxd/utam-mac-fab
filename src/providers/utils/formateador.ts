// LIBRARIES
import moment from 'moment';
// CONSTANTS
import { SERVIDOR_IMAGEN } from '../../constants/uta-api';

declare var require: any;
var Hypher = require('hypher');
var spanish = require('hyphenation.es');
var h = new Hypher(spanish);

export class FormateadorProvider {

      /**
      *Formatea un array de objetos que enlista todas las asignaturas por codigo de asignatura (no estan agrupadas por semestre):
      */
      static formatearInscripciones(inscripciones: any) {
            if (!inscripciones) return [];
            let tmp = {};
            Object.keys(inscripciones).forEach(semestre => { //INDICES DEL SEMESTRE: 44,43,42,41
                  let asignaturas = inscripciones[semestre];
                  Object.keys(asignaturas).forEach(asignatura => { //OBTENGO LOS INDICES DE UNA ASIGNATURA: 0,1,2
                        let tipos_clases = asignaturas[asignatura]['TIPOS'];
                        Object.keys(tipos_clases).forEach(tipo_clase => { //OBTENGO LOS INDICES DE TIPO: 0,1,2
                              tmp[tipos_clases[tipo_clase].CUR_CODIGO] = {
                                    "nombre": asignaturas[asignatura].NOMBRE,
                                    "tipo_clase": tipos_clases[tipo_clase].TIPO,
                                    "cod_periodo": semestre
                              }
                        })
                  })
            });
            return tmp;
      }

      /**
      *Formatea el RUT poniendo los puntos y el guion:
      * 183139614 => 18.313.961-4
     */
      static formatearRUT(rut: string, digito_verificador: string) {

            let largo_rut = rut.length;
            let rut_invertido = "";
            let formato_rut = digito_verificador + '-';

            //INVIERTE EL RUT: 18313961 => 16931381
            let i;
            for (i = (largo_rut - 1); i >= 0; i--) {
                  rut_invertido = rut_invertido + rut.charAt(i);
            }

            //AGREGA EL DV Y PONE LOS PUNTOS AL RUT: 169.313.81 => 4-169.313.81
            let cnt = 0;
            for (i = 0; i < largo_rut; i++) {
                  if (cnt == 3) {
                        formato_rut = formato_rut + '.';
                        formato_rut = formato_rut + rut_invertido.charAt(i);
                        cnt = 1;
                  }
                  else {
                        formato_rut = formato_rut + rut_invertido.charAt(i);
                        cnt++;
                  }
            }
            rut_invertido = "";

            //INVIERTE EL RUT PARA DEJARLO EN EL FORMATO CORRECTO: 18.313.961-4 Y DEJA K EN MAYUSCULA
            for (i = (formato_rut.length - 1); i >= 0; i--) {
                  if (formato_rut.charAt(i) == 'k')
                        rut_invertido = rut_invertido + 'K';
                  else
                        rut_invertido = rut_invertido + formato_rut.charAt(i);
            }
            return rut_invertido;

      }

      /**
      *Obtiene el primer nombre a partir del string con los nombres:
      * Cristian Andres => Cristian
         */
      static formatearPrimerNombre(nombres: string) {

            let fin_primer_nombre = nombres.indexOf(' ');
            let primer_nombre = "";

            let i;
            for (i = 0; i < fin_primer_nombre; i++) {
                  primer_nombre = primer_nombre + nombres.charAt(i);
            }
            return primer_nombre;

      }

      /**
      *Formatea la carrera separando el codigo, nombre y plan de carrera de un string:
      * 534-ING.CIVIL COMPUTACION E INFORMATICA(INGENIERIA CIVIL EN COMPUTACION E INFORMATICA)(2010 ver.1 )
      * ===============================================>
      * {
      *   cod_carrera: "534",
      *   nombre_carrera: "ING.CIVIL COMPUTACION E INFORMATICA(INGENIERIA CIVIL EN COMPUTACION E INFORMATICA"
      *   plan_carrera: "2010"
      * }
     */
      static formatearCarrera(carrera: string) {

            if (carrera && carrera != "SIN MATRICULA ACTIVA") {
                  let fin_cod = carrera.indexOf('-');
                  let fin_nombre = carrera.indexOf('(');
                  let inicio_plan = carrera.lastIndexOf('(');

                  let cod_carrera = "";
                  let nombre_carrera = "";
                  let plan_carrera = "";

                  let i;
                  //OBTIENE EL CODIGO DE LA CARRERA
                  for (i = 0; i < fin_cod; i++) {
                        cod_carrera = cod_carrera + carrera.charAt(i);
                  }

                  //OBTIENE EL NOMBRE DE LA CARRERA
                  for (i = fin_cod + 1; i < fin_nombre; i++) {
                        nombre_carrera = nombre_carrera + carrera.charAt(i);
                  }

                  //OBTIENE EL AÑO DE LA MALLA DE LA CARRERA
                  for (i = inicio_plan + 1; i < inicio_plan + 5; i++) {
                        plan_carrera = plan_carrera + carrera.charAt(i);
                  }

                  let carrer = { "cod_carrera": cod_carrera, "nombre_carrera": nombre_carrera, "plan_carrera": plan_carrera };
                  return carrer;
            }
            else {
                  let carrer = { "cod_carrera": "--", "nombre_carrera": "--", "plan_carrera": "--" };
                  return carrer;
            }

      }

      static formatearImagen(sexo: any) {
            let image_url;
            if (sexo == 'Femenino') {
                  image_url = "./assets/images/avatar/girl1.svg";
                  return image_url;
            }
            else {
                  image_url = "./assets/images/avatar/man1.svg";
                  return image_url;
            }
      }

      /**
      *Formatea el array de vista principal para los mensajes (grupos de leidos/no leidos y ultimo mensaje)
      * {
      *   43: {
      *      no_leidos: [
      *         {
      *            CUR_CODIGO: 20173740,
      *            ULTIMO_MENSAJE: 14-12-2017 18:07
      *         },
      *         {
      *            CUR_CODIGO: 20172413,
      *            ULTIMO_MENSAJE: 13-11-2017 00:43
      *         }
      *      ],
      *      leidos: [
      *         {
      *            CUR_CODIGO: 20173740,
      *            ULTIMO_MENSAJE: 14-12-2017 18:07
      *         },
      *      ]
      *   },
      *   44: {
      *      ...
      *   }
      * }
      */
      static formatearMensajeNoLeido(no_leidos: any, leidos: any, periodos) {

            let tmp = {};

            if (periodos && no_leidos && periodos) {

                  Object.keys(periodos).forEach(annio => {
                        Object.keys(periodos[annio].SEMESTRES).forEach(index_semestre => {
                              let cod_semestre = periodos[annio].SEMESTRES[index_semestre].PERIODO;

                              tmp[cod_semestre] = {};
                              tmp[cod_semestre]['leidos'] = [];
                              tmp[cod_semestre]['no_leidos'] = [];

                              if (no_leidos[cod_semestre]) {
                                    let asignaturas = no_leidos[cod_semestre];

                                    Object.keys(asignaturas).forEach(cod_asignatura => { //CODIGOS ASIGNATURAS => 201610004148

                                          if (leidos[cod_semestre] && leidos[cod_semestre][cod_asignatura]) { //SI HAY MENSAJES EN EL SEMESTRE Y EN LA ASIGNATURA

                                                let cantidad_mensajes = leidos[cod_semestre][cod_asignatura].length - 1;
                                                let fecha_envio = leidos[cod_semestre][cod_asignatura][cantidad_mensajes].FECHAENVIO;
                                                let hora_envio = leidos[cod_semestre][cod_asignatura][cantidad_mensajes].HORAENVIO;

                                                if (asignaturas[cod_asignatura] != '0') { //SI TIENE MENSAJES NO LEIDOS => no_leidos[42][2064349029],...

                                                      let correlativos = '';
                                                      leidos[cod_semestre][cod_asignatura].map(data => {

                                                            if (!data.FECHALEIDO) {
                                                                  if (correlativos == '') {
                                                                        correlativos = correlativos + data.CORRELATIVO;
                                                                  }
                                                                  else {
                                                                        correlativos = correlativos + ',' + data.CORRELATIVO;
                                                                  }
                                                            }
                                                      });

                                                      tmp[cod_semestre]['no_leidos'].push({
                                                            CUR_CODIGO: cod_asignatura,
                                                            ULTIMO_MENSAJE: fecha_envio + ' ' + hora_envio,
                                                            CANTIDAD: asignaturas[cod_asignatura],
                                                            CORRELATIVOS: correlativos
                                                      });
                                                }
                                                else {
                                                      tmp[cod_semestre]['leidos'].push({
                                                            CUR_CODIGO: cod_asignatura,
                                                            ULTIMO_MENSAJE: fecha_envio + ' ' + hora_envio
                                                      });
                                                }
                                          }

                                    })
                              }
                        })
                  })
            }

            return tmp;
      }

      /**
      *Formatea el array de periodos:
      * [
      *   {
      *       ANO: 2017,
      *       SEMESTRES: [
      *           {
      *               PERIODO: "44",
      *               ANO: "2017",
      *               SEMESTRE: "2",
      *               F_INI: "2017-07-21",
      *               F_TER: "2018-01-05"
      *           }
      *       ]
      *   }
      * ]
      * ===============================================>
      * [
      *   {
      *       ANO: "2017",
      *       F_INIC: "2017-07-21",
      *       F_TER: "2018-01-05",
      *       PERIODO: "44",
      *       SEMESTRE: "2"
      *   },
      *   {
      *       ANO: "2017",
      *       F_INIC: "2017-03-05",
      *       F_TER: "2017-07-12",
      *       PERIODO: "43",
      *       SEMESTRE: "1"
      *   }
      * ]
     */
      static formatearPeriodo(periodos, inscripciones) {
            console.log("formateo periodoo....");
            let tmp = [];
            if (periodos) {
                  periodos.forEach(periodo => { //2016, 2017
                        periodo.SEMESTRES.forEach(semestre => { //0, 1         //semestre.PERIODO=41,42,44
                              if (!inscripciones[semestre.PERIODO]) {
                                    semestre.cantidad_asignaturas = 0 + ' ASIGNATURAS';
                              }
                              else {
                                    semestre.cantidad_asignaturas = inscripciones[semestre.PERIODO].length; //inscripciones[44].length
                                    if (semestre.cantidad_asignaturas == 1) semestre.cantidad_asignaturas += ' ASIGNATURA'
                                    else semestre.cantidad_asignaturas += ' ASIGNATURAS'
                              }
                              tmp.push(semestre);
                        });
                  });
            }

            return tmp;
      }

      /**
      *Formatea las noticias ordenandolas por fecha.
      */
      static formatearNoticias(noticias) {

            for (let i = 0; i < noticias.length; i++) {
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/&aacute;/g, "á");
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/&eacute;/g, "é");
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/&iacute;/g, "í");
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/&oacute;/g, "ó");
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/&uacute;/g, "ú");
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/&ntilde;/g, "ñ");
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/<strong>/g, "<b>");
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/<\/strong>/g, "</b>");

                  const regex2 = /\sstyle\s*=\s*"[\w\s-:,;%]+"/gi;
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(regex2, "");
                  const regex3 = /\salign\s*=\s*"[\w\s-:,;%]+\s*"/gi;
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(regex3, "");
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(/"/gi, "");
                  const regex4 = />[\w\s-:.,;%áéíóúñ@]+\s*</gi;
                  noticias[i].CUERPO = noticias[i].CUERPO.replace(regex4, function (x) {
                        return h.hyphenateText(x)
                  });
            }


            let nuevo_array = noticias.sort(function (a, b) {
                  a = moment(a.FECHA, "DD/MM/YYYY HH:mm");
                  b = moment(b.FECHA, "DD/MM/YYYY HH:mm");
                  return a > b ? -1 : a < b ? 1 : 0;
            });

            return nuevo_array;
      }

      static formatearHorario(horario) {

      }

      static formatearAsistencias(asistencia) {
            if (!asistencia) return [];

            Object.keys(asistencia).forEach(semestre => {
                  let data_semestre = asistencia[semestre];
                  Object.keys(data_semestre).forEach(asignatura => {
                        //console.log("aqui???: ", data_semestre[asignatura]);

                        let data_asignatura = data_semestre[asignatura];
                        data_asignatura['clases'] = [];

                        Object.keys(data_asignatura).forEach(clase => {
                              if (clase != 'porcentaje' && clase != 'clases') {
                                    data_asignatura['clases'].push(data_asignatura[clase]);
                                    delete data_asignatura[clase];
                              }
                        });
                        data_asignatura['clases'] = data_asignatura['clases'].reverse();
                  })

            });
            console.log("dta: ", asistencia);
            return asistencia;
      }

      static formatearProcesoInscripcion(inscripcion) {

      }

      /**
      *Formatea toda la data de la aplicación.
      */
      static formatearData(response, user_id) {
            console.log("formateando los datos");
            let data;
            data = response.sesion[0].datos;
            data.id_estudiante = user_id;

            data.personal.RUT = this.formatearRUT(data['personal'].PER_NRUT, data['personal'].PER_DRUT);
            data.personal.PRIMER_NOMBRE = this.formatearPrimerNombre(data['personal'].PNA_NOM);
            data.personal.IMAGEN_ANIMADA = this.formatearImagen(data['personal'].SEX_DSC);

            data.noticias = this.formatearNoticias(data.noticias);
            data.personal.foto = data['foto'] ? SERVIDOR_IMAGEN + data['foto'] : '';
            data.carrera = this.formatearCarrera(data['personal'].MATRICULA_ACTIVA);
            data.asignaturas = this.formatearInscripciones(data['inscripcion']);
            data.asistencia = this.formatearAsistencias(data['asistencia']);
            data.MensajeNoLeido = this.formatearMensajeNoLeido(data['MensajeNoLeido'], data['mensajes'], data['periodos']);
            data.periodos = this.formatearPeriodo(data['periodos'], data['inscripcion']);
            console.log("fin de formateo datos. \ndata: ", data);
            return data;
      }







}
