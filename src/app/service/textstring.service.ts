import {Injectable} from '@angular/core';

/** A service to define and provide text strings */
@Injectable()
export class TextStringService {
  public SERVER_ERROR = 'There was an error retrieving data from the server.';
  public EPP_CLTRID = 'WBP-00000';
  public PERMISSION_EPP = 'EPP';
  public PERMISSION_SERVER_SIDE_STATUS = 'SERVER_SIDE_STATUS';
  public PERMISSION_CRU_REGISTRY_ADMIN = 'CRU_REGISTRY_ADMIN';
  public PERMISSION_CRU_REGISTRY_USER = 'CRU_REGISTRY_USER';
  public PERMISSION_CRU_REGISTRAR_ADMIN = 'CRU_REGISTRAR_ADMIN';
  public PERMISSION_CRU_REGISTRAR_USER = 'CRU_REGISTRAR_USER';
  public PERMISSION_CRU_TLD = 'CRU_TLD';
  public PERMISSION_CRU_REGISTRAR = 'CRU_REGISTRAR';
  public PERMISSION_CRU_PRICE_CATEGORIES = 'CRU_PRICE_CATEGORIES';
  public serverStatuses = {
    serverDeleteProhibited: 'Server Delete Prohibited',
    serverUpdateProhibited: 'Server Update Prohibited',
    serverHold: 'Server Hold',
    serverRenewProhibited: 'Server Renew Prohibited',
    serverTransferProhibited: 'Server Transfer Prohibited'
  };
  /**
    * List of displayed server statuses and descriptions for contacts
    * a subset of this.serverStatuses
    */
  public contactServerDisplayStatuses = {};

  constructor() {
    for (const key in this.serverStatuses) {
      if (this.serverStatuses.hasOwnProperty(key)) {
        const displayValue = this.serverStatuses[key];
        if (key.indexOf('Delete') > -1 || key.indexOf('Update') > -1) {
          this.contactServerDisplayStatuses[key] = displayValue;
        }
      }
    }
  }
}
