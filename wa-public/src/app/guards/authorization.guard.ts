import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../services/app-config.service';

@Injectable()
export class AuthorizationGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private oidcSecurityService: OidcSecurityService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    if (!AppConfigService.settings.oidc) {
      // IdP authentication is not enabled
      return of(true);
    }
    return combineLatest(
      this.checkUser(),
      this.checkUserRoles(route.data.roles),
    ).pipe(
      map(([res1, res2]) => {
        return res1 && res2;
      }),
    );
  }

  canLoad(route: Route): Observable<boolean> {
    if (!AppConfigService.settings.oidc) {
      // IdP authentication is not enabled
      return of(true);
    }
    return combineLatest(
      this.checkUser(),
      this.checkUserRoles(route.data.roles),
    ).pipe(
      map(([res1, res2]) => {
        return res1 && res2;
      }),
    );
  }

  private checkUser(): Observable<boolean> {
    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        if (!isAuthorized) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      }),
    );
  }

  private checkUserRoles(requiredRoles: string[]): Observable<boolean> {
    const idTokenPayload = this.oidcSecurityService.getPayloadFromIdToken();
    let clientRoles: string[];
    try {
      clientRoles =
        idTokenPayload.resource_access[AppConfigService.settings.oidc.client_id]
          .roles;
    } catch (err) {
      // No resource_access object for this user on this client id
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    } else {
      if (!clientRoles || clientRoles.length === 0) {
        return of(false);
      }
      return of(requiredRoles.every(role => clientRoles.indexOf(role) > -1));
    }
  }
}
