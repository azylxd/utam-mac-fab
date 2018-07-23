import { Component, Input } from '@angular/core';
import { AVISOS } from '../../constants/avisos';

@Component({
  selector: 'my-notice',
  templateUrl: 'my-notice.html'
})
export class MyNoticeComponent {

  notice_data = {};

  @Input() notice;
  @Input() wheader;
  constructor() { }

  ngOnInit() {
    console.log("notice: ", this.notice);
    if(typeof this.notice === 'object'){
      this.notice_data['title'] = this.notice['title'];
      this.notice_data['body'] = this.notice['body'];
      this.notice_data['image'] = this.notice['image'];
    }
    else if (AVISOS[this.notice]) {
      this.notice_data['title'] = AVISOS[this.notice].title;
      this.notice_data['body'] = AVISOS[this.notice].body;
      this.notice_data['image'] = AVISOS[this.notice].image;
    }
    else {
      this.notice_data['title'] = AVISOS['ERROR'].title;
      this.notice_data['body'] = AVISOS['ERROR'].body;
      this.notice_data['image'] = AVISOS['ERROR'].image;
    }
  }

}
