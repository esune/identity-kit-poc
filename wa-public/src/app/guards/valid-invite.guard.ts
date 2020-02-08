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

    if (this.stateService.getInviteToken()) {
      // token was previously validated and was already stored in the state
      console.log('Token is in state, proceeding', this.stateService.getInviteToken());
      return true;
    }

    // check token validity and act accordingly
    return this.stateService.isValidToken(inviteToken).pipe(
      tap(obs => (this.actionSvc.email = obs.email)),
      map(obs => {
        if (!obs || !obs.active) {
          // no token/invalid token/used token
          return this.router.createUrlTree(['unauthorized']);
        }

        // token is valid, store in state
        this.stateService.setInviteToken(inviteToken);

        if (obs.active && obs.expired) {
          // token expired
          return this.router.createUrlTree([`request`]);
        }

        // valid active token
        return this.router.createUrlTree([`accept`]);
      }),
    );
  }
}
