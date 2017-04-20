import { SearchResults } from '../../model/search-results.model';
import { Registrar } from '../../model/registrar.model';

const searchdb: {[key: string]: SearchResults} = {
  'dev.dev': {
    'data': [
      {
        'dataList': [
          {
            'contacts': [],
            'currentSponsorClientId': 'brodaddy',
            'domainName': 'dev.dev',
            'hosts': [],
            'iannaNumber': 5678,
            'price': {
              'currency': 'USD',
              'value': 20.0
            },
            'priceCategory': null,
            'registrar': 'BroDaddy',
            'status': 'OK',
            'systemTags': 'REG',
            'tld': 'dev'
          }
        ],
        'type': 'DOMAINS'
      }
    ]
  },
  'unregistered.dev': {
    'data': [
      {
        'dataList': [
          {
            'currentSponsorClientId': null,
            'domainName': 'unregistered.dev',
            'iannaNumber': null,
            'price': {
              'currency': 'USD',
              'value': 20.0
            },
            'priceCategory': '',
            'registrar': null,
            'status': 'AVAILABLE',
            'systemTags': '',
            'tld': 'dev'
          }
        ],
        'type': 'DOMAINS'
      }
    ]
  }
};

export function getSearchResult(term: string): SearchResults {
  return searchdb[term];
}

const registrar: Registrar = {
  registrarName: 'Donuts, Inc.'
} as Registrar;

export function getRegistrar(): Registrar {
  return registrar;
}
