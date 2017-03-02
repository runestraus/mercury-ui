import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpClient {

  constructor(private http: Http, private oauthService: OAuthService) { }

  private getHeaders(): Headers {
    return new Headers({
      'Authorization': `Bearer ${this.oauthService.getAccessToken()}`
    });
  }

  get(url: string): Observable<Response> {
    return this.http.get(environment.baseRoute + url, {headers: this.getHeaders()});
  }

  post(url: string, data): Observable<Response> {
    return this.http.post(environment.baseRoute + url, data, {headers: this.getHeaders()});
  }

  put(url: string, data): Observable<Response> {
    return this.http.put(environment.baseRoute + url, data, {headers: this.getHeaders()});
  }

  delete(url: string): Observable<Response> {
    return this.http.delete(environment.baseRoute + url, {headers: this.getHeaders()});
  }

  handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
