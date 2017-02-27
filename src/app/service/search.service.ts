import {Injectable} from '@angular/core';
import {Domain} from '../model/domain.model';

@Injectable()
export class SearchService {
  result: Domain[] = [{
    domainName: 'best.pizza',
    tld: 'pizza',
    clientId: 'tldsrus'}];

  getDomains(query: string): Domain[] {
    return this.result;
  }
}
