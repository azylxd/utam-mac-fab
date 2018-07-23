/**
*Formatea el RUT poniendo los puntos y el guion:
*183139614 => 18.313.961-4
*/
/*formatearRUT(rut: string, digito_verificador: string) {

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
}*/