import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  
  notice = 'NO_NOTIFICATION';

  data_notification = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get('notification').then(result => {
      if(result) this.data_notification = result;
      else this.data_notification = [];
      console.log("data notification: ", this.data_notification);
    })


    console.log('ionViewDidLoad NotificationsPage');
  }

}
