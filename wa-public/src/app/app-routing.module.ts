import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceptDisclaimerComponent } from './components/accept-disclaimer/accept-disclaimer.component';
import { AutoLoginComponent } from './components/auto-login/auto-login.component';
import { HomeComponent } from './components/home/home.component';
import { RequestTokenComponent } from './components/request-token/request-token.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthorizationGuard } from './guards/authorization.guard';
import { ValidInviteGuard } from './guards/valid-invite.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CompletedComponent } from './pages/completed/completed.component';
import { SuccessComponent } from './pages/success/success.component';
import { TrackComponent } from './pages/track/track.component';

const routes: Routes = [
  { path: 'autologin', component: AutoLoginComponent },
  { path: 'forbidden', component: UnauthorizedComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '',
    component: HomeComponent,
    canActivate: [ValidInviteGuard],
  },
  {
    path: 'validate',
    component: HomeComponent,
    canActivate: [ValidInviteGuard],
  },
  {
    path: 'accept',
    component: AcceptDisclaimerComponent,
    canActivate: [ValidInviteGuard, AuthorizationGuard],
  },
  {
    path: 'success',
    component: SuccessComponent,
    canActivate: [ValidInviteGuard, AuthorizationGuard],
  },
  {
    path: 'issue-credential/:id',
    component: TrackComponent,
    canActivate: [ValidInviteGuard, AuthorizationGuard],
  },
  {
    path: 'completed',
    component: CompletedComponent,
  },
  {
    path: 'request',
    component: RequestTokenComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
