import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-card-header',
  templateUrl: 'my-card-header.html'
})
export class MyCardHeaderComponent {

  @Input() year;
  @Input() semester;
  @Input() sum;
  
  constructor() {}

  ngOnInit() {
    console.log("param year: ", this.year);
    console.log("param semest: ", this.semester);
    console.log("param sum: ", this.sum);
  }

}
