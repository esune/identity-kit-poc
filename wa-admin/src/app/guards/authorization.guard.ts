import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthorizationGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private oidcSecurityService: OidcSecurityService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkUser();
  }

  canLoad(state: Route): Observable<boolean> {
    return this.checkUser();
  }

  private checkUser(): Observable<boolean> {
    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        if (!isAuthorized) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      })
    );
  }
}
