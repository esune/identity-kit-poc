import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject } from 'rxjs';
import { IInvitationRecord } from '../shared/interfaces/invitation-record.interface';

export type StateType = 'invited' | 'confirmed';

export interface IUser {
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private $$userList = new BehaviorSubject<IInvitationRecord[]>(null);

  private _changeRecords = new Set<string>();

  private _state: StateType = 'invited';
  user: IUser;

  get state() {
    return this._state;
  }

  set state(state: StateType) {
    this._state = state;
  }

  get changeRecords() {
    return this._changeRecords;
  }
  $userList = this.$$userList.asObservable();

  clearChangeRecords() {
    this._changeRecords.clear();
  }

  set userList(records: IInvitationRecord[]) {
    this.$$userList.next(records);
  }

  get userList() {
    return this.$$userList.getValue();
  }

  setUserList(records: IInvitationRecord[]) {
    this.$$userList.next(records);
  }

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.getUserData().subscribe((userData: any) => {
      this.user = userData;
    });
  }
}
