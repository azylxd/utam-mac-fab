import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class EvaluacionesProvider {
    constructor(
        private storage: Storage
    ) { }

	/**
	*Obtiene las evaluaciones desde el storage.
	*/
    getAllEvaluations(): Promise<any> {
        return this.storage.get('evaluacion');
    }

    getEvaluationsByPeriod(id_period) {
        return this.getAllEvaluations().then(result => {
            if (result) return result[id_period];
            else return result;
        })
    }

    getEvaluationsBySubject(id_period, id_subject) {
        // return this.getEvaluationsByPeriod(id_period).then(result => {
        //     if (result) return result[id_subject];
        //     else return {};
        // })
        return this.storage.get('evaluacion').then(result => {
            return result[id_period][id_subject]
        })
    }

}

