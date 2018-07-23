import { Component } from '@angular/core';

/**
 * Generated class for the MyCardSubjectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-card-subject',
  templateUrl: 'my-card-subject.html'
})
export class MyCardSubjectComponent {

  text: string;

  constructor() {
    console.log('Hello MyCardSubjectComponent Component');
    this.text = 'Hello World';
  }

}
