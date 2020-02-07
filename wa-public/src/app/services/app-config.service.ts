import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpenIdConfiguration } from 'angular-auth-oidc-client';

export interface IAppConfig {
  env: {
    name: string;
  };

  apiServer: {
    url: string;
  };

  baseUrl: string;

  csbAudio: {
    siteUrl: string;
  };

  oidc: OpenIdConfiguration;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  static settings: IAppConfig;

  constructor(private http: HttpClient) {}

  load() {
    const jsonFile = 'assets/config/config.json';

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(jsonFile)
        .toPromise()
        .then((response: IAppConfig) => {
          AppConfigService.settings = response as IAppConfig;

          console.log('Config Loaded');
          console.log(AppConfigService.settings);

          resolve();
        })
        .catch((response: any) => {
          reject(`Could not load the config file`);
        });
    });
  }
}
