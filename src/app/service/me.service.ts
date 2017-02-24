import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/http.client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MeService {

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get('/api/me')
      .map(res => res.json());
  }
}
