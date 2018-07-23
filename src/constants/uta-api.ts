// PROXY
export const UTA_API_PROXY = '/uta/api/';

// ENDPOINTS
export const UTA_API_PROD = 'https://sisaca.uta.cl/wwwregistraduria/public/movil/index/';
export const UTA_API_DEV = 'https://desasisaca.uta.cl/wwwregistraduria/public/movil/index/';
export const UTA_API = UTA_API_PROD;

// RUTAS
export const UTA = {
    INICIAR_SESION: UTA_API + 'iniciar-sesion',
    OBTENER_DATOS: UTA_API + 'actualizar-datos',
    ENVIAR_IDS: UTA_API + 'grabar-playerid',
    ENVIAR_MENSAJE: UTA_API + 'nuevo-mensaje',
    LEER_MENSAJE: UTA_API + 'marcar-leido',
    OBTENER_DATOS_INSCRIPCION: UTA_API + 'obtener-asignaturas',
    ENVIAR_INSCRIPCION: UTA_API + 'inscripcion',
    CERRAR_SESION: UTA_API + 'cerrar-sesion',
    SEND_NOTIFICATION: UTA_API + 'notifica'
};

// RECURSOS
export const SERVIDOR_IMAGEN = 'http://chitita.uta.cl/fotos/';
export const SERVIDOR_RECURSOS = 'https://academico.uta.cl';

