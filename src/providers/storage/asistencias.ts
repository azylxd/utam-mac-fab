import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AsistenciasProvider {
    constructor(
        private storage: Storage
    ) { }

	/**
	*Obtiene las asistencia desde el storage.
	*/
    getAsistenciasData(): Promise<any> {
        return this.storage.get('asistencia')
            .then(data => !data ? [] : data);
    }
}
