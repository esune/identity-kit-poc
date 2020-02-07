import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'waa-unauthorized',
  template: `
    <div>You have no rights to access this resource. Please Login</div>
  `,
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
