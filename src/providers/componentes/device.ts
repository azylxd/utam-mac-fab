import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';

@Injectable()
export class DeviceProvider {

  constructor(
    private device: Device,
    public platform: Platform,
  ) { }

  getDeviceInfo() {
    if (this.platform.is('cordova')) return `${this.device.manufacturer} ${this.device.model}/${this.device.platform} ${this.device.version}/${this.device.uuid}`;
    else return null;
  }

}
