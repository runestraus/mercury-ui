import { Injectable } from '@angular/core';
import { TextStringService } from './textstring.service';
import { EppHelperService, EppMessageAndStatus } from '../epp/epphelper.service';
import {
  domainCreate, domainTransfer, domainInfo, domainDelete, DomainUpdateInfo,
  domainUpdate, domainRestore, domainStatusUpdate, domainRenew, domainCheck
} from '../epp/domainepp.template';
import { extractText, extractStatuses, extractArray, extractTypes, extractBoolean, extractField } from '../epp/epputil';
import { DomainInfo, TransferDetail, DomainDetail, DomainPrice, DomainPrices } from '../model/domain.model';

/**
 *  Domains epp service
 *
 * <p>
 * Sends and receives domains related epp xml messages. For more information about
 * host related epp xml messages, see
 * {@link https://tools.ietf.org/html/rfc5732}
 * </p>
 */
@Injectable()
export class DomainEppService {

  constructor(private textStrings: TextStringService, private eppHelper: EppHelperService) {
  }

  create(domain: DomainInfo): Promise<EppMessageAndStatus> {
    const clTrid = this.textStrings.EPP_CLTRID;
    const xml = domainCreate(domain, clTrid);
    return this.eppHelper.send(xml).toPromise()
      .then(result => this.eppHelper.getEppMessageAndStatus(result));
  }

  transfer(name: string, authorizationCode: string, operation: string): Promise<TransferDetail> {
    const xml = domainTransfer(name, this.textStrings.EPP_CLTRID, authorizationCode, operation);
    return this.eppHelper.send(xml).toPromise()
      .then(result => {
        const resultData = result['epp']['response']['resData']['domain:trnData'];
        return {
          name: extractText(resultData, 'domain:name'),
          trStatus: extractText(resultData, 'domain:trStatus'),
          reID: extractText(resultData, 'domain:reID'),
          reDate: extractText(resultData, 'domain:reDate'),
          acID: extractText(resultData, 'domain:acID'),
          acDate: extractText(resultData, 'domain:acDate'),
          exDate: extractText(resultData, 'domain:exDate')
        } as TransferDetail;
      });
  }

  info(domain: string, authorizationCode: string): Promise<DomainDetail> {
    const xml = domainInfo(domain, this.textStrings.EPP_CLTRID, authorizationCode);
    return this.eppHelper.send(xml).toPromise()
      .then(result => {
        const resultData = result['epp']['response']['resData'];
        const domainDetail: DomainDetail = {
          fullyQualifiedDomainName: extractText(resultData, 'domain:infData', 'domain:name'),
          status: extractStatuses(resultData['domain:infData'], 'domain:status'),
          repoId: extractText(resultData, 'domain:infData', 'domain:roid'),
          currentSponsorClientId: extractText(resultData, 'domain:infData', 'domain:clID'),
          creationClientId: extractText(resultData, 'domain:infData', 'domain:crID'),
          creationTime: extractText(resultData, 'domain:infData', 'domain:crDate'),
          lastEppUpdateClientId: extractText(resultData, 'domain:infData', 'domain:upID'),
          lastEppUpdateTime: extractText(resultData, 'domain:infData', 'domain:upDate'),
          lastTransferTime: extractText(resultData, 'domain:infData', 'domain:trDate'),
          registrationExpirationTime: extractText(resultData, 'domain:infData', 'domain:exDate'),
          authInfo: extractText(resultData, 'contact:infData', 'contact:authInfo', 'contact:pw'),
          nameservers: extractArray(resultData, 'domain:infData', 'domain:ns', 'domain:hostObj'),
          subordinateHosts: extractArray(resultData, 'domain:infData', 'domain:host'),
          contacts: extractTypes(resultData, 'domain:infData', 'domain:contact'),
          rgpStatus: extractField(result, 'epp', 'response', 'extension', 'rgp:infData', 'rgp:rgpStatus', '@s'),
          domainPrices: this.getPriceData(result['epp']['response']['extension']['fee:infData'])
        } as DomainDetail;
        if (resultData['domain:infData']['domain:registrant']) {
          domainDetail.contacts['registrant'] = extractText(resultData, 'domain:infData', 'domain:registrant');
        }
        return domainDetail;
      });

  }

  check(domain: string) {
    const clTrid = this.textStrings.EPP_CLTRID;
    const xml = domainCheck(domain, clTrid);
    return this.eppHelper.send(xml).toPromise()
      .then(result => {
        const resultData = result['epp']['response']['resData']['domain:chkData'];
        let cd = resultData['domain:cd'];
        if (Array.isArray(cd)) {
          cd = cd[0];
        }
        const hasPrices = result['epp']['response']['extension']['fee:chkData'] != null;
        return {
          fullyQualifiedDomainName: extractText(cd, 'domain:name'),
          avail: extractBoolean(cd, 'domain:name', '@avail'),
          reason: extractText(cd, 'domain:reason'),
          domainPrices: hasPrices ? this.getPriceData(result['epp']['response']['extension']['fee:chkData']['fee:cd']).prices : {}
        };
      });
  }

  deleteDomain(domain: string): Promise<EppMessageAndStatus> {
    const clTrid = this.textStrings.EPP_CLTRID;
    const xml = domainDelete(domain, clTrid);
    return this.eppHelper.send(xml).toPromise()
      .then(result => this.eppHelper.getEppMessageAndStatus(result));
  }

  update(name: string, updateInfo?: DomainUpdateInfo): Promise<EppMessageAndStatus> {
    const clTrid = this.textStrings.EPP_CLTRID;
    const xml = domainUpdate(name, clTrid, updateInfo);
    return this.eppHelper.send(xml).toPromise()
      .then(result => this.eppHelper.getEppMessageAndStatus(result));
  }

  renew(name: string,
        currentExpirationDate: string,
        newRegistrationPeriod: string,
        renewPrice?: string,
        renewCurrency?: string): Promise<EppMessageAndStatus> {
    const clTrid = this.textStrings.EPP_CLTRID;
    const xml = domainRenew(name, clTrid, currentExpirationDate, newRegistrationPeriod, renewPrice, renewCurrency);
    return this.eppHelper.send(xml).toPromise()
      .then(result => this.eppHelper.getEppMessageAndStatus(result));
  }

  restore(domain: string): Promise<EppMessageAndStatus> {
    const clTrid = this.textStrings.EPP_CLTRID;
    const xml = domainRestore(domain, clTrid);
    return this.eppHelper.send(xml).toPromise()
      .then(result => this.eppHelper.getEppMessageAndStatus(result));
  }

  updateStatus(name: string, addStatuses: Array<string>, remStatuses: Array<string>): Promise<EppMessageAndStatus> {
    const clTrid = this.textStrings.EPP_CLTRID;
    const xml = domainStatusUpdate(name, clTrid, addStatuses, remStatuses);
    return this.eppHelper.send(xml).toPromise()
      .then(result => this.eppHelper.getEppMessageAndStatus(result));
  }

  private getPriceData(prices: any[]): DomainPrices {
    if (!Array.isArray(prices)) {
      prices = [prices];
    }

    return {
      class: extractText(prices, 'fee:class'),
      prices: prices.reduce((o: { [key: string]: DomainPrice; }, item) => {
        let commandFees = [];
        if (item['fee:fee']) {
          commandFees = item['fee:fee'];
          if (!Array.isArray(commandFees)) {
            commandFees = [commandFees];
          }
        }
        o[extractText(item, 'fee:command')] = {
          currency: extractText(item, 'fee:currency'),
          period: extractText(item, 'fee:period'),
          periodUnit: extractText(item, extractField(item, 'fee:period', '@unit')),
          fee: commandFees.reduce((fees: { [key: string]: string; }, fee) => {
            fees[extractField(fee, '@description')] = extractText(fee);
            return fees;
          }, {})
        };
        return o;
      }, {}),
    } as DomainPrices;
  }
}
