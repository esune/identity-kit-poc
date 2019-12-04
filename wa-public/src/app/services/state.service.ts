import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const apiUrl = '/api/';

export interface IUser extends Keycloak.KeycloakProfile {
  _id?: string;
  guid?: string;
}

export interface IValidateLink {
  _id: string;
  expired: boolean;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _isAuth = false;
  private _title = 'Identity Kit POC';
  _id: string;
  guid: string;


  user: IUser = {};
  private _apiUrl: string;

  isValidToken(token: string): Observable<IValidateLink> {
    const url = `${this._apiUrl}invitations/${token}/validate`;
    return this.http.get<IValidateLink>(url);
  }

  get isAuth() {
    return this._isAuth;
  }

  get title() {
    return this._title;
  }

  constructor(private http: HttpClient) {
    this._apiUrl = apiUrl;
  }
}
