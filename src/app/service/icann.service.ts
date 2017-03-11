// Copyright 2017 Donuts Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/http.client';
import { IcannDns } from '../model/icannDns.counter.model';
import { IcannRegistrar } from '../model/icannRegistrar.counter.model';
import { IcannTld } from '../model/icannTld.counter.model';
import { Tld } from '../model/tld.model';

@Injectable()
export class IcannService {

  constructor(private http: HttpClient) { }

  /**
   * Get all tld's in the system
   *
   * @returns {Promise<R>|Observable<R>|promise.Promise<R>|Maybe<T>|Promise<Promise<any>>}
   */
  getAllTlds(): Promise<Tld[]> {
    return this.http.get('/api/tlds').toPromise()
      .then(res => res.json() as Tld)
      .catch(this.http.handleError);
  }

  /**
   * Gets the current DNS counters.
   *
   * @returns {Promise<DnsCounter>}
   */
  getIcannDns(icannDns: IcannDns): Promise<IcannDns> {
    return this.http.get('/api/icann/dns/' + icannDns.tld + '/' + icannDns.year + '/' + icannDns.month).toPromise()
      .then(res => res.json() as IcannDns)
      .catch(this.http.handleError);
  }

  /**
   * Submit the DNS Counter form.
   *
   * @param dialogResult - DnsCounter model
   * @returns {Observable<R>|Maybe<T>|Promise<Promise<any>>|promise.Promise<R>|Promise<R>}
   */
  submitIcannDns(dialogResult: IcannDns) {
    return this.http.post('/api/icann/dns', dialogResult).toPromise()
      .then(res => {
        return res.json() as IcannDns;
      })
      .catch(error => {
        return Promise.reject(error.json().message || error);
      });
  };

  /**
   * Gets the current TLD counters.
   *
   * @returns {Promise<TldCounter>}
   */
  getIcannTld(icannTld: IcannTld): Promise<IcannTld> {
    return this.http.get('/api/icann/tld/' + icannTld.tld + '/' + icannTld.year + '/' + icannTld.month).toPromise()
      .then(res => res.json() as IcannTld)
      .catch(this.http.handleError);
  }

  /**
   * Submit the TLD Counter form.
   *
   * @param dialogResult - TldCounter model
   * @returns {Observable<R>|Maybe<T>|Promise<Promise<any>>|promise.Promise<R>|Promise<R>}
   */
  submitIcannTld(dialogResult: IcannTld) {
    return this.http.post('/api/icann/tld', dialogResult).toPromise()
      .then(res => res.json() as IcannTld)
      .catch(this.http.handleError);
  };

  /**
   * Gets the current Registrar counters.
   *
   * @returns {Promise<RegistrarCounter>}
   */
  getIcannRegistrar(icannRegistrar: IcannRegistrar): Promise<IcannRegistrar> {
    return this.http.get('/api/icann/registrar/' + icannRegistrar.clientId + '/' + icannRegistrar.tld
    + '/' + icannRegistrar.year + '/' + icannRegistrar.month).toPromise()
      .then(res => res.json() as IcannRegistrar)
      .catch(this.http.handleError);
  }

  /**
   * Submit the Registrar Counter form.
   *
   * @param dialogResult - RegistrarCounter model
   * @returns {Observable<R>|Maybe<T>|Promise<Promise<any>>|promise.Promise<R>|Promise<R>}
   */
  submitIcannRegistrar(dialogResult: IcannRegistrar) {
    return this.http.post('/api/icann/registrar', dialogResult).toPromise()
      .then(res => res.json() as IcannRegistrar)
      .catch(this.http.handleError);
  };
}
