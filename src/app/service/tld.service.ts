import {Injectable} from "@angular/core";
import {Tld} from "../model/tld.model";
@Injectable()
export class TldService {
  private tlds: Tld[] = [{
    "name": "abc",
    "description": null,
    "state": "PREDELEGATION",
    "delegationDate": "1970-01-01T00:00:00.000Z",
    "escrowEnabled": false,
    "stateTransitions": {"1970-01-01T00:00:00.000Z": "PREDELEGATION"},
    "premiumPriceAckRequired": true,
    "createBillingCost": {"value": 100.00, "currency": "USD"},
    "restoreBillingCost": {"value": 400.00, "currency": "USD"},
    "reservedListsNames": null,
    "currency": {
      "code": "USD",
      "numericCode": 840,
      "decimalPlaces": 2,
      "defaultFractionDigits": 2,
      "currencyCode": "USD",
      "symbol": "$",
      "numeric3Code": "840",
      "countryCodes": ["PR", "SV", "MP", "PW", "FM", "GU", "TC", "VG", "AS", "VI", "TL", "MH", "US", "EC"],
      "pseudoCurrency": false
    },
    "dnsPaused": true
  }, {
    "name": "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
    "description": null,
    "state": "PREDELEGATION",
    "delegationDate": "1970-01-01T00:00:00.000Z",
    "escrowEnabled": false,
    "stateTransitions": {"1970-01-01T00:00:00.000Z": "PREDELEGATION"},
    "premiumPriceAckRequired": true,
    "createBillingCost": {"value": 200.00, "currency": "USD"},
    "restoreBillingCost": {"value": 800.00, "currency": "USD"},
    "reservedListsNames": null,
    "currency": {
      "code": "USD",
      "numericCode": 840,
      "decimalPlaces": 2,
      "defaultFractionDigits": 2,
      "currencyCode": "USD",
      "symbol": "$",
      "numeric3Code": "840",
      "countryCodes": ["PR", "SV", "MP", "PW", "FM", "GU", "TC", "VG", "AS", "VI", "TL", "MH", "US", "EC"],
      "pseudoCurrency": false
    },
    "dnsPaused": true
  }, {
    "name": "city",
    "description": null,
    "state": "PREDELEGATION",
    "delegationDate": "1970-01-01T00:00:00.000Z",
    "escrowEnabled": false,
    "stateTransitions": {"1970-01-01T00:00:00.000Z": "PREDELEGATION"},
    "premiumPriceAckRequired": true,
    "createBillingCost": {"value": 100.00, "currency": "USD"},
    "restoreBillingCost": {"value": 200.00, "currency": "USD"},
    "reservedListsNames": null,
    "currency": {
      "code": "USD",
      "numericCode": 840,
      "decimalPlaces": 2,
      "defaultFractionDigits": 2,
      "currencyCode": "USD",
      "symbol": "$",
      "numeric3Code": "840",
      "countryCodes": ["PR", "SV", "MP", "PW", "FM", "GU", "TC", "VG", "AS", "VI", "TL", "MH", "US", "EC"],
      "pseudoCurrency": false
    },
    "dnsPaused": true
  }];

  getTlds(): Tld[] {
    return this.tlds;
  }
}
