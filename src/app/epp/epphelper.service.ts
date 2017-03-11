import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { convertToJson } from './xml2json';
import { TextStringService } from '../service/textstring.service';
import { HttpClient } from '../shared/http.client';

/** Message and status from epp response */
export interface EppMessageAndStatus {
  code: string;
  message: string;
}

/** Common epp service functionality */
@Injectable()
export class EppHelperService {
  constructor(private http: HttpClient, private text: TextStringService) {}

  /**
   * Sends epp xml request to the server
   *
   * <p>If the server response code is 200, the xml response is parsed into a
   * javascript object and the contents of result are returned. If the response
   * code is not 200, an error message is returned.
   *
   * @param xml Payload of the epp xml request
   * @return Result object or error message angular.Promise
   */
  send(xml: string): Observable<any> {
    return this.http.post('/api/epp', xml, new Headers({
        'Content-Type': 'application/xml',
    })).map(response => {
      const parsed = convertToJson(response.text());
      const result = this.getEppMessageAndStatus(parsed);
      // Success result codes begin with 1
      // https://tools.ietf.org/html/rfc5730#section-3
      // Login error codes are 2002 and 2200.
      if (result.code.substring(0, 1) === '1' ||
          (result.code === '2002' && result.message === 'Registrar is already logged in')) {
        return parsed;
      }
      throw parsed;
    }).catch(err => {
      try {
        return Observable.throw(this.getEppMessageAndStatus(err));
      } catch (e) {
        return Observable.throw(this.setEppErrorMessageAndStatus());
      }
    });
  }

  /** Extract message and status from response payload */
  public getEppMessageAndStatus(result: Object): EppMessageAndStatus {
    const resultInfo: EppMessageAndStatus = {
      code: result['epp']['response']['result']['@code'],
      message: result['epp']['response']['result']['msg']['keyValue'],
    };
    return resultInfo;
  }

  /** simulate an epp error response */
  private setEppErrorMessageAndStatus(): Object {
    return {
      epp: {
        response: {
          result: {
            '@code': '500',
            'msg': {
              'keyValue': this.text.SERVER_ERROR
            }
          }
        }
      }
    };
  }
}
