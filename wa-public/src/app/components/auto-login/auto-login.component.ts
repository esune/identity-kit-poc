import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'wap-auto-login',
  template: `
    <div>
      Redirecting to Identity Provider login...
    </div>
  `,
  styleUrls: ['./auto-login.component.scss'],
})
export class AutoLoginComponent implements OnInit {

  constructor(public oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.onModuleSetup.subscribe(() => {
      this.onModuleSetup();
    });
  }

  ngOnInit() {
    if (this.oidcSecurityService.moduleSetup) {
      this.onModuleSetup();
    }
  }

  private onModuleSetup() {
    this.oidcSecurityService.authorize();
  }
}
