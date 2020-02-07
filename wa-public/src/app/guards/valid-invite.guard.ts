import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StateService } from '../services/state.service';
import { map, tap } from 'rxjs/operators';
import { ActionService } from '../services/action.service';

@Injectable({
  providedIn: 'root',
})
export class ValidInviteGuard implements CanActivate {
  constructor(
    private stateService: StateService,
    private router: Router,
    private actionSvc: ActionService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const inviteToken = route.queryParamMap.get('invite_token');

    return this.stateService.isValidToken(inviteToken).pipe(
      tap(obs => (this.actionSvc.email = obs.email || '')),
      map(obs => {
        console.log('Observable:', obs);
        if (!obs) {
          // no token/invalid token
          return false;
        }
        if (!obs.active) {
          // token was already used
          console.log('Navigating to /');
          return this.router.createUrlTree(['/']);
        }
        if (obs.active && obs.expired) {
          // token expired
          console.log(`Navigating to request/${inviteToken}`);
          return this.router.createUrlTree([`request/${inviteToken}`]);
        }
        // valid active token
        console.log(`Navigating to accept/${inviteToken}`);
        return this.router.createUrlTree([`accept/${inviteToken}`]);
      }),
    );
  }
}
