import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import {
  AuthModule,
  ConfigResult,
  OidcConfigService,
  OidcSecurityService
} from 'angular-auth-oidc-client';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutoLoginComponent } from './components/auto-login/auto-login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthorizationGuard } from './guards/authorization.guard';
import { AppConfigService } from './services/app-config.service';
import { FormConfigService } from './services/form-config.service';
import { SharedModule } from './shared/shared.module';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

export function initializeApp(
  oidcConfigService: OidcConfigService,
  appConfigService: AppConfigService,
  formConfigService: FormConfigService
) {
  console.log('Executing APP_INITIALIZER...');
  return () =>
    appConfigService.load().then(() => {
      Promise.all([
        oidcConfigService.load_using_stsServer(
          AppConfigService.settings.oidc.stsServer
        ),
        formConfigService.load()
      ]);
    });
}

@NgModule({
  declarations: [AppComponent, NotFoundComponent, AutoLoginComponent, UnauthorizedComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthModule.forRoot()
  ],
  providers: [
    AppConfigService,
    FormConfigService,
    OidcSecurityService,
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [OidcConfigService, AppConfigService, FormConfigService],
      multi: true
    },
    AuthorizationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService
  ) {
    this.oidcConfigService.onConfigurationLoaded.subscribe(
      (configResult: ConfigResult) => {
        this.oidcSecurityService.setupModule(
          AppConfigService.settings.oidc,
          configResult.authWellknownEndpoints
        );
      }
    );
    console.log('Starting app...');
  }
}
