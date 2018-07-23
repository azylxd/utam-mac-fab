import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class PeriodosProvider {

    constructor(
        private storage: Storage
    ) { }

	/**
	*Obtiene los periodos desde el storage
	*/
    getPeriodosData(): Promise<any> {
        return this.storage.get('periodos');
    }

    /**
    *Obtiene el código del período actual
    */
    getPeriodoActual(): Promise<any> {
        return this.storage.get('periodos')
            .then(response => {
                return response[0].PERIODO;
            })
    }

    getLastPeriodo() {
        return this.storage.get('periodos')
            .then(response => {
                let index = response.length;
                console.log(response[index].PERIODO);
                return response[index].PERIODO;
            })
    }
}
