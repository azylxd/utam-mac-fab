import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ScheduleProvider {

  constructor(private storage: Storage) { }

  getScheduleData(){
    return this.storage.get('horario')
  }

}


