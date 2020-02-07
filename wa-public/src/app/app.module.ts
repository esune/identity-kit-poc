import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import {
  AuthModule,
  ConfigResult,
  OidcConfigService,
  OidcSecurityService,
} from 'angular-auth-oidc-client';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceptDisclaimerComponent } from './components/accept-disclaimer/accept-disclaimer.component';
import { CardListItemComponent } from './components/card-list-item/card-list-item.component';
import { CardToolbarComponent } from './components/card-toolbar/card-toolbar.component';
import { CredentialIssuanceComponent } from './components/credential-issuance/credential-issuance.component';
import { InputComponent } from './components/input/input.component';
import { IssuePreviewComponent } from './components/issue-preview/issue-preview.component';
import { RequestTokenComponent } from './components/request-token/request-token.component';
import { ViewWrapperComponent } from './components/view-wrapper/view-wrapper.component';
import { AuthorizationGuard } from './guards/authorization.guard';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CompletedComponent } from './pages/completed/completed.component';
import { SuccessComponent } from './pages/success/success.component';
import { TrackComponent } from './pages/track/track.component';
import { AppConfigService } from './services/app-config.service';
import { FormConfigService } from './services/form-config.service';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AutoLoginComponent } from './components/auto-login/auto-login.component';

export function initializeApp(
  oidcConfigService: OidcConfigService,
  appConfigService: AppConfigService,
  formConfigService: FormConfigService,
) {
  console.log('Executing APP_INITIALIZER...');
  return () =>
    appConfigService.load().then(() => {
      Promise.all([
        oidcConfigService.load_using_stsServer(
          AppConfigService.settings.oidc.stsServer,
        ),
        formConfigService.load(),
      ]);
    });
}

const matModules = [
  MatSidenavModule,
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatMenuModule,
  ReactiveFormsModule,
  MatListModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatInputModule,
];

const components = [
  CardToolbarComponent,
  ViewWrapperComponent,
  CredentialIssuanceComponent,
  HomeComponent,
  SuccessComponent,
  PageNotFoundComponent,
  InputComponent,
  IssuePreviewComponent,
  CardListItemComponent,
  TrackComponent,
  RequestTokenComponent,
  AcceptDisclaimerComponent,
  CompletedComponent,
];

@NgModule({
  declarations: [[...components], AppComponent, UnauthorizedComponent, AutoLoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatNativeDateModule,
    [...matModules],
    IonicModule.forRoot(),
    AuthModule.forRoot(),
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
      multi: true,
    },
    AuthorizationGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService,
  ) {
    this.oidcConfigService.onConfigurationLoaded.subscribe(
      (configResult: ConfigResult) => {
        this.oidcSecurityService.setupModule(
          AppConfigService.settings.oidc,
          configResult.authWellknownEndpoints,
        );
      },
    );
    console.log('Starting app...');
  }
}
