import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GapiLoader {

  constructor() { }

  load (api: string) {
    return this.createApi(api);
  }
  _loadApi (api: string, observer) {
    const gapiAuthLoaded = window['gapi'] && window['gapi'].auth2 && window['gapi'].auth2.getAuthInstance();
    if (gapiAuthLoaded && gapiAuthLoaded.currentUser) {
      return observer.next(gapiAuthLoaded);
    }
    window['gapi'].load(api, response => observer.next(response));
  }

  createApi (api: string) {
    const api$ = new Subject();
    const isGapiLoaded = window['gapi'] && window['gapi'].load;
    const onApiLoaded = () => this._loadApi(api, api$);
    if (isGapiLoaded) {
      onApiLoaded();
    } else {
      window['apiLoaded'] = onApiLoaded;
    }
    return api$;
  }
}
