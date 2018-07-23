import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class CarreraProvider {
    constructor(
        private storage: Storage
    ) { }

	/**
	*Obtiene la carrera desde el storage
	*/
    getCarreraData(): Promise<any> {
        return this.storage.get('carrera');
    }

    getCodCarrera(): Promise<any> {
        return this.storage.get('carrera')
            .then(response => {
                return response.cod_carrera;
            })
    }

}

