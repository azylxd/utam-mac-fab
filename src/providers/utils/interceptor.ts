import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    //TODAS LAS PETICIONES PASAN POR EL HTTPINTERCEPTOR: INICIAR SESIÒN, ACTUALIZAR DATOS, GRABAR PLAYERID, CERRAR SESIÒN
    /**
     *
     * @param req petición HTTP
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req);
        return next.handle(req)
            .timeout(100000)
            .do(event => {
            }, err => {
                //console.log("peticion: ", req, "\nstatus: ", err.status);
                if (err instanceof HttpErrorResponse) { //SI ES UNA RESPUESTA HTTP
                    //if(err.name == "TimeoutError") throw({error: "Tiempo de espera agotado"})
                    if (err.status == 0) throw ({ error: "Revise su conexión a intenet" })
                    else if (err.status == 404) {
                        //console.log("El servidor no encuentra la ruta..");
                        throw ({ error: "Problema de comunicación con nuestros servidores" })
                    }
                    //console.log("peticion: ", req, "\nstatus: ", err.status);
                    //Observable.throw(err);
                }
                else {
                    throw ({ error: "Tiempo de espera agotado" })
                    //console.log("tiempo de espera agotado");
                    //throw ({ error: 408 });

                }
            });
    }

    /* intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       return next.handle(req)
       .do(event => {
 
       }, err => {
           if (err instanceof HttpErrorResponse) { // here you can even check for err.status == 404 | 401 etc
               console.log(err.status, "Error Caught By Interceptor");
               //Observable.throw(err); // send data to service which will inform the component of the error and in turn the user
           }
       });
   } */
}
