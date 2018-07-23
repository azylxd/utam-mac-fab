import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class NotificationsProvider {

    constructor(
        private storage: Storage,
    ) { }

	/**
	*Obtiene los periodos desde el storage
	*/
    getNotificationsData(): Promise<any> {
        return this.storage.get('notification');
    }

    /**
    *Obtiene el código del período actual
    */
    setNotification(data): Promise<any> {
        return this.getNotificationsData().then(result => {
            if (result) {
                result.unshift(data);
                this.storage.set('notification', result)
            }
            else this.storage.set('notification', [result])
        })
    }
}
