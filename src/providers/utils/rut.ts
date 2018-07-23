export class RutProvider {

   /**
   *Calcula el digito verificador y ve si coincide con el ingresado (18.313.961-4 => 4)
   */
   private chequearDV(rut: string) {

      let largo = rut.length;

      let suma = 0;
      let mul = 0;
      let res = 0;
      let i = 0;
      let dvr = '0';
      let dvi = 0;

      //OBTIENE SOLO DIGITO VERIFICADOR
      let digito_verificador = rut.charAt(largo - 1);

      //QUITA EL DIGITO VERIFICADOR
      rut = rut.substring(0, largo - 1);

      suma = 0;
      mul = 2;
      for (i = rut.length - 1; i >= 0; i--) {
         suma = suma + +rut.charAt(i) * mul;
         if (mul == 7) {
            mul = 2;
         }
         else {
            mul++;
         }
      }
      res = suma % 11;

      if (res == 1) {
         dvr = 'k';
      }
      else {
         if (res == 0) {
            dvr = '0';
         }
         else {
            dvi = 11 - res;
            dvr = dvi + "";
         }
      }

      if (dvr != digito_verificador.toLowerCase()) {
         return false;
      }

      return true;
   }

   /**
   *Limpia el RUT de puntos y guiones: 18.313.961-4 => 183139614
   */
   limpiarRut(rut) {
      let rut_limpio = rut.replace(".", "");
      rut_limpio = rut_limpio.replace(".", "");
      rut_limpio = rut_limpio.replace(/-/, "");

      return rut_limpio;
   }

   /**
   *Saca el digito verificador del RUT: 183139614 => 18313961
   */
   soloRUT(rut) {
      let rut_limpio = this.limpiarRut(rut);
      let largo_rut = rut_limpio.length;
      rut_limpio = rut_limpio.substring(0, largo_rut - 1);

      return rut_limpio;
   }

   /**
   *Comprueba de que el RUT sea válido. Retorna el error.
   */
   verificarRut(rut) {
      let rut_limpio = this.limpiarRut(rut);
      let largo_rut = rut_limpio.length;
      let error;

      if (largo_rut < 8) {
         error = "RUT incompleto."
         return error;
      }

      let tmpstr = rut_limpio;
      tmpstr = tmpstr.substring(0, tmpstr.length - 1); //SACA EL DV => 18313961

      //COMPRUEBA EL RUT
      if (!this.chequearDV(rut_limpio)) {
         error = "RUT no válido."
         return error;
      }

      return false;
   }

   /**
   *Va eliminando digitos no válidos o cuando halla más de 9 digitos: (distintos a [0-9]K)
   */
   digitosValidosRut(rut) {
      let largo_rut = rut.length;

      if (largo_rut > 9) { //SI EL INPUT TIENE MAS DE 9 DIGITOS BORRO EL ULTIMO DIGITO
         rut = rut.substring(0, largo_rut - 1);
      }
      else {
         rut = rut.replace(/[^0-9\K\k]/g, ''); //REEMPLAZO CUALQUIER VALOR DISTINTO DE 0-9Kk
      }

      return rut;
   }

   /**
   *Formatea el RUT: 183139614 => 18.313.961-4
   */
   formatearRut(rut) {

      let largo_rut = rut.length;
      if (largo_rut == 0) {
         return rut;
      }

      let rut_invertido = this.invertirRut(rut);

      //GENERA EL DIGITO VERIFICADOR 4-
      let digito_verificador = "";
      digito_verificador = digito_verificador + rut_invertido.charAt(0) + '-';

      //PONE LOS PUNTO DEL RUT 169.313.961-4
      let i;
      let contador = 0;
      rut = digito_verificador;
      for (i = 1; i < largo_rut; i++) {
         if (contador == 3) {
            rut = rut + '.';
            rut = rut + rut_invertido.charAt(i);
            contador = 1;
         }
         else {
            rut = rut + rut_invertido.charAt(i);
            contador++;
         }
      }
      rut_invertido = this.invertirRut(rut);

      return rut_invertido;

   }

   /**
   *Invierte el RUT: 183139614 => 416931381, 4-169.313.81 => 18.313.961-4
   */
   private invertirRut(rut) {
      let i;
      let largo_rut = rut.length;
      let rut_invertido = '';
      for (i = (largo_rut - 1); i >= 0; i--) {
         rut_invertido = rut_invertido + rut.charAt(i);
      }

      return rut_invertido;
   }

}
