import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginComponent } from './components/auto-login/auto-login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthorizationGuard } from './guards/authorization.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    data: { roles: ['wa-admin'] },
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home',
    canActivate: [AuthorizationGuard],
    data: { roles: ['wa-admin'] },
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  { path: 'autologin', component: AutoLoginComponent },
  { path: 'forbidden', component: UnauthorizedComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
