import { Injectable } from '@angular/core';
import { TextStringService } from '../service/textstring.service';
import { EppHelperService, EppMessageAndStatus } from '../epp/epphelper.service';
import * as contactepp from '../epp/contactepp.template';
import {
  ContactDetail,
  ContactPostalInfo,
  ContactAddress,
  ContactDisclose,
  ContactAuthInfo,
  ContactCheckResponse
} from './contact.model';
import { extractExtension, extractText, extractStatuses, extractType, extractAvail } from '../epp/epputil';
import 'rxjs/add/observable/throw';

/**
 * Contacts epp service
 *
 * <p>
 * Sends and receives contacts related epp xml messages. For more information about
 * contact related epp xml messages, see
 * {@link https://tools.ietf.org/html/rfc5732}
 * </p>
 */
@Injectable()
export class ContactEppService {

  constructor(
    private textStrings: TextStringService,
    private eppHelper: EppHelperService) {}

  infoContact(contactId: string): Promise<ContactDetail> {
    return new Promise((resolve, reject) => {
      const clTrid = this.textStrings.EPP_CLTRID;
      // add authinfo as optional param
      // https://tools.ietf.org/html/rfc5733#section-3.1.2
      const xml = contactepp.contactInfo(contactId, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        const resultData = result['epp']['response']['resData']['contact:infData'];
        const contact: ContactDetail = {
          contactId: extractText(resultData, 'contact:id'),
          currentSponsorClientId: extractText(resultData, 'contact:clID'),
          creationClientId: extractText(resultData, 'contact:crID'),
          repoId: extractText(resultData, 'contact:roid'),
          email: extractText(resultData, 'contact:email'),
          voice: extractText(resultData, 'contact:voice'),
          voiceExtension: extractExtension(resultData, 'contact:voice'),
          fax: extractText(resultData, 'contact:fax'),
          faxExtension: extractExtension(resultData, 'contact:fax'),
          // XXX: crDate is not currently provided in response xml
          // see https://github.com/google/domain-registry/issues/12
          creationTime: extractText(resultData, 'contact:crDate'),
          lastEppUpdateClientId: extractText(resultData, 'contact:upID'),
          lastEppUpdateTime: extractText(resultData, 'contact:upDate'),
          lastTransferTime: extractText(resultData, 'contact:trDate'),
          status: extractStatuses(resultData, 'contact:status'),
          authInfo: extractAuthInfo(resultData),
          postalInfo: extractPostalInfo(resultData),
          disclose: extractDisclose(resultData),
        };
        resolve(contact);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Contact check epp command
   *
   * @param contactId
   * @return ContactCheckResponse availability for the specified id
   */
  checkContact(contactId: string): Promise<ContactCheckResponse> {
    return new Promise((resolve, reject) => {
      const clTrid = this.textStrings.EPP_CLTRID;
      const xml = contactepp.contactCheck(contactId, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        // convert contact check JXON to ContactCheck object
        const resultData = result['epp']['response']['resData']['contact:chkData'];
        // expect a single check result back
        // if multiple check results are found, show the first one.
        let checkData = resultData['contact:cd'];
        if (Array.isArray(checkData)) {
          checkData = checkData[0];
        }
        const checkResult: ContactCheckResponse = {
          contactId: extractText(checkData, 'contact:id'),
          avail: extractAvail(checkData, 'contact:id'),
          reason: extractText(checkData, 'contact:reason'),
        };
        resolve(checkResult);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Contact delete epp command
   *
   * @param contactId
   * @return Epp result message and status code
   */
  deleteContact(contactId: string): Promise<EppMessageAndStatus> {
    return new Promise((resolve, reject) => {
      const clTrid = this.textStrings.EPP_CLTRID;
      const xml = contactepp.contactDelete(contactId, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        resolve(this.eppHelper.getEppMessageAndStatus(result));
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Contact update epp command
   *
   * @param item Contact update data
   * @return Epp result message and status code
   */
  updateContact(item: any): Promise<EppMessageAndStatus> {
    return new Promise((resolve, reject) => {
      const clTrid = this.textStrings.EPP_CLTRID;
      const xml = contactepp.contactUpdate(item, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        resolve(this.eppHelper.getEppMessageAndStatus(result));
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Contact update status epp command
   *
   * @param contactId
   * @param addedStatuses
   * @param removedStatuses
   * @return Epp result message and status code
   */
  updateContactStatus(
    contactId: string,
    addedStatuses: Array<string>,
    removedStatuses: Array<string>
  ): Promise<EppMessageAndStatus> {
    return new Promise((resolve, reject) => {
      const clTrid = this.textStrings.EPP_CLTRID;
      const xml = contactepp.contactUpdateStatus(
        contactId, clTrid, addedStatuses, removedStatuses);
      this.eppHelper.send(xml).forEach(result => {
        resolve(this.eppHelper.getEppMessageAndStatus(result));
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Contact create epp command
   *
   * @param item Contact creation data
   * @return Epp result message and status code
   */
  createContact(item: any): Promise<EppMessageAndStatus> {
    return new Promise((resolve, reject) => {
      const clTrid = this.textStrings.EPP_CLTRID;
      const xml = contactepp.contactCreate(item, clTrid);
      this.eppHelper.send(xml).forEach(result => {
        resolve(this.eppHelper.getEppMessageAndStatus(result));
      }).catch(err => {
        reject(err);
      });
    });
  }
}

function extractAuthInfo(resultData: any): ContactAuthInfo {
  if (resultData['contact:authInfo']) {
    return {
      pw: extractText(resultData['contact:authInfo'], 'contact:pw')
    };
  }
  return null;
}

function extractDisclose(resultData: any): ContactDisclose {
  if (resultData['contact:disclose']) {
    const discloseData = resultData['contact:disclose'];
    return {
      email: extractText(discloseData, 'contact:email'),
      voice: extractText(discloseData, 'contact:voice'),
      fax: extractText(discloseData, 'contact:fax'),
      name: extractType(discloseData, 'contact:name'),
      org: extractType(discloseData, 'contact:org'),
      addr: extractType(discloseData, 'contact:addr'),
      flag: parseInt(discloseData['@flag'], 10),
    };
  }
  return null;
}

function extractPostalInfo(resultData: any): Array<ContactPostalInfo> {
  let contactPostalInfo = resultData['contact:postalInfo'];
  if (!Array.isArray(contactPostalInfo)) {
    contactPostalInfo = [ contactPostalInfo ];
  }
  return contactPostalInfo.map((info: any): ContactPostalInfo => {
    return {
      type: info['@type'] === 'int' ? 'INTERNATIONALIZED' : 'LOCALIZED',
      name: extractText(info, 'contact:name'),
      org: extractText(info, 'contact:org'),
      address: extractAddress(info['contact:addr']),
    };
  });
}

function extractAddress(addressData: any): ContactAddress {
  let streets = addressData['contact:street'] || [];
  if (!Array.isArray(streets)) {
    streets = [ streets ];
  }
  streets = streets.map(street => {
    return 'keyValue' in street ? street['keyValue'] : '';
  });
  return {
    city: extractText(addressData, 'contact:city'),
    countryCode: extractText(addressData, 'contact:cc'),
    state: extractText(addressData, 'contact:sp'),
    zip: extractText(addressData, 'contact:pc'),
    street1: streets[0] || '',
    street2: streets[1] || '',
    street3: streets[2] || '',
  };
}
