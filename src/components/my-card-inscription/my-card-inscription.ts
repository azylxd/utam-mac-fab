import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-card-inscription',
  templateUrl: 'my-card-inscription.html'
})
export class MyCardInscriptionComponent {

  @Input() inscription;
  @Input() elective; //BOLEAN SOLO PARA INDICAR SI HAY ELECTIVO O NO
  @Input() current_elective; //ELECTIVO ACTUAL
  constructor() {}
  ngOnInit(){
    //console.log("current_elective: ", this.current_elective)
  }

}
