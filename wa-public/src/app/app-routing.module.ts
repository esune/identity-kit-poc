import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceptDisclaimerComponent } from './components/accept-disclaimer/accept-disclaimer.component';
import { AutoLoginComponent } from './components/auto-login/auto-login.component';
import { RequestTokenComponent } from './components/request-token/request-token.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthorizationGuard } from './guards/authorization.guard';
import { ValidInviteGuard } from './guards/valid-invite.guard';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CompletedComponent } from './pages/completed/completed.component';
import { SuccessComponent } from './pages/success/success.component';
import { TrackComponent } from './pages/track/track.component';

const routes: Routes = [
  { path: 'autologin', component: AutoLoginComponent },
  { path: 'forbidden', component: UnauthorizedComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'validate',
    component: HomeComponent,
    canActivate: [ValidInviteGuard],
  },
  {
    path: 'success',
    component: SuccessComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'issue-credential/:id',
    component: TrackComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'accept/:id',
    component: AcceptDisclaimerComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'request/:id',
    component: RequestTokenComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'completed',
    component: CompletedComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
