import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpClient {

  constructor(private http: Http, private oauthService: OAuthService) { }

  private addAuthorizationToHeaders(headers: Headers): Headers {
    if (!headers) {
      headers = new Headers({});
    }
    headers.set('Authorization', `Bearer ${this.oauthService.getAccessToken()}`);
    return headers;
  }

  get(url: string, headers?: Headers): Observable<Response> {
    return this.http.get(environment.baseRoute + url, {headers: this.addAuthorizationToHeaders(headers)});
  }

  post(url: string, data, headers?: Headers): Observable<Response> {
    return this.http.post(environment.baseRoute + url, data, {headers: this.addAuthorizationToHeaders(headers)});
  }

  put(url: string, data, headers?: Headers): Observable<Response> {
    return this.http.put(environment.baseRoute + url, data, {headers: this.addAuthorizationToHeaders(headers)});
  }

  delete(url: string, headers?: Headers): Observable<Response> {
    return this.http.delete(environment.baseRoute + url, {headers: this.addAuthorizationToHeaders(headers)});
  }

  handleError(error: any): Promise<any> {
    return Promise.reject(error.json().message || error);
  }
}
