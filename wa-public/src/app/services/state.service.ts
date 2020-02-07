import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

export interface IUser {
  _id?: string;
  guid?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IValidateLink {
  _id: string;
  expired: boolean;
  active: boolean;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private apiURL: string;
  user: IUser;

  constructor(private http: HttpClient) {
    this.apiURL = AppConfigService.settings.apiServer.url;
  }

  get inviteToken() {
    return localStorage.getItem('inviteToken');
  }

  set inviteToken(id: string) {
    localStorage.setItem('inviteToken', id);
  }

  get email(): string {
    return localStorage.getItem('email');
  }

  isValidToken(token: string): Observable<IValidateLink> {
    const url = `${this.apiURL}/invitations/${token}/validate`;
    return this.http.get<IValidateLink>(url);
  }
}
