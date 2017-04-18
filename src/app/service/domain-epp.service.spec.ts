import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { DomainEppService } from './domain-epp.service';
import { HttpModule } from '@angular/http';
import { TextStringService } from './textstring.service';
import { EppHelperService } from '../epp/epphelper.service';
import {
  domainCreate, domainTransfer, domainInfo, domainDelete, domainUpdate,
  domainRenew, domainRestore, domainStatusUpdate
} from '../epp/domainepp.template';
import { DomainInfo } from '../model/domain.model';
import {
  infoForDomainDomainResponse, checkForAvailableDomainResponse,
  infoForPremiumDomainInAddPeriodResponse, checkForAvailablePremiumDomainResponse
} from './testing/data/domains-test-data';

describe('DomainEppService', () => {
  let service: DomainEppService;
  const mockEppHelper = {
    send: jasmine.createSpy('eppHelperService.send'),
    getEppMessageAndStatus: jasmine.createSpy('eppHelperService.getEppMessageAndStatus')
  };

  let eppHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DomainEppService,
        { provide: EppHelperService, useValue: mockEppHelper },
        TextStringService,
      ]
    });
  });

  beforeEach(inject([DomainEppService, EppHelperService], (_service: DomainEppService, _eppHelper: EppHelperService) => {
    service = _service;
    eppHelper = _eppHelper;
  }));

  it('should submit a domain create', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve('the result');
      }
    });
    eppHelper.getEppMessageAndStatus.and.returnValue('successful');
    const domain: DomainInfo = {
      clientId: 'brodaddy',
      fullyQualifiedDomainName: 'www.donuts.domains',
      registrationPeriod: '2018',
      domainNameserversArray: [],
      authInfo: 'authorized'
    };
    service.create(domain)
      .then(result => expect(result).toBe('successful'));
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainCreate(domain, 'WBP-00000'));
    expect(eppHelper.getEppMessageAndStatus).toHaveBeenCalledWith('the result');
  }));

  it('should submit a domain delete', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve('the result');
      }
    });
    eppHelper.getEppMessageAndStatus.and.returnValue('successful');
    const domain = 'DeletedDomain';
    service.deleteDomain(domain)
      .then(result => expect(result).toBe('successful'));
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainDelete(domain, 'WBP-00000'));
    expect(eppHelper.getEppMessageAndStatus).toHaveBeenCalledWith('the result');
  }));

  it('should submit domain transfer and extract correct TransferDetail', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve(
          createEppJsonResponse({
            'domain:trnData': {
              'domain:name': { 'keyValue': 'donuts.domains' },
              'domain:trStatus': { 'keyValue': 'theStatus' },
              'domain:reID': { 'keyValue': 'theId' },
              'domain:reDate': { 'keyValue': 'theReDate' },
              'domain:acID': { 'keyValue': 'theAcId' },
              'domain:acDate': { 'keyValue': 'theAcDate' },
              'domain:exDate': { 'keyValue': 'theExDate' }
            }
          }));
      }
    });
    service.transfer('donuts.domains', 'abc1234', 'transfer')
      .then(result => {
        expect(result.name).toBe('donuts.domains');
        expect(result.trStatus).toBe('theStatus');
        expect(result.reID).toBe('theId');
        expect(result.reDate).toBe('theReDate');
        expect(result.acID).toBe('theAcId');
        expect(result.acDate).toBe('theAcDate');
        expect(result.exDate).toBe('theExDate');
      });
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainTransfer('donuts.domains', 'WBP-00000', 'abc1234', 'transfer'));
  }));

  it('should submit domain info and extract correct DomainDetail', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve(infoForDomainDomainResponse);
      }
    });
    service.info('donuts.domains', 'abc1234')
      .then(result => {
        expect(result.authInfo).toBe('54as78659df0879gh8');
        expect(result.creationClientId).toBe('donuts_301');
        expect(result.fullyQualifiedDomainName).toBe('domain.domain');
        expect(result.status).toContain('clientTransferProhibited');
        expect(result.status).toContain('clientUpdateProhibited');
        expect(result.status).toContain('clientDeleteProhibited');
        expect(result.repoId).toBe('y5s76fgo8h');
        expect(result.currentSponsorClientId).toBe('donuts_300');
        expect(result.creationTime).toBe('2006-11-11T19:22:10+00:00');
        expect(result.lastEppUpdateClientId).toBe('donuts_302');
        expect(result.lastEppUpdateTime).toBe('2009-08-19T21:17:32+00:00');
        expect(result.lastTransferTime).toBe('2011-02-02T21:40:31+00:00');
        expect(result.registrationExpirationTime).toBe('2016-05-15T11:34:54+00:00');
        expect(result.nameservers).toContain('ns1.domain.domain');
        expect(result.nameservers).toContain('ns2.domain.domain');
        expect(result.subordinateHosts).toContain('www.domain.domain');
        expect(result.subordinateHosts).toContain('mail.domain.domain');
        expect(result.contacts['admin']).toBe('donuts_300');
        expect(result.contacts['tech']).toBe('donuts_300');
        expect(result.contacts['billing']).toBe('donuts_300');
        expect(result.contacts['registrant']).toBe('donuts_300');
        expect(result.rgpStatus).toBe('');
        expect(result.domainPrices.prices['renew']).toBeDefined();
        expect(result.domainPrices.prices['renew'].currency).toBe('USD');
        expect(result.domainPrices.prices['renew'].fee['renew']).toBe('8.00');

      });
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainInfo('donuts.domains', 'WBP-00000', 'abc1234'));
  }));

  it('should submit domain info and return rgpStatus', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve(infoForPremiumDomainInAddPeriodResponse);
      }
    });
    service.info('donuts.domains', 'abc1234')
      .then(result => {
        expect(result.rgpStatus).toBe('addPeriod');
      });
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainInfo('donuts.domains', 'WBP-00000', 'abc1234'));
  }));

  it('should submit a domain update', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve('the result');
      }
    });
    eppHelper.getEppMessageAndStatus.and.returnValue('successful');
    const domain = 'UpdatedDomain';
    service.update(domain)
      .then(result => expect(result).toBe('successful'));
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainUpdate(domain, 'WBP-00000'));
    expect(eppHelper.getEppMessageAndStatus).toHaveBeenCalledWith('the result');
  }));

  it('should submit a domain renew', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve('the result');
      }
    });
    eppHelper.getEppMessageAndStatus.and.returnValue('successful');
    const domain = 'RenewedDomain';
    service.renew(domain, '2006-11-11T19:22:10+00:00', '312312', '500', 'USD')
      .then(result => expect(result).toBe('successful'));
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainRenew(domain, 'WBP-00000', '2006-11-11T19:22:10+00:00', '312312', '500', 'USD'));
    expect(eppHelper.getEppMessageAndStatus).toHaveBeenCalledWith('the result');
  }));

  it('should submit a domain restore', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve('the result');
      }
    });
    eppHelper.getEppMessageAndStatus.and.returnValue('successful');
    const domain = 'RestoredDomain';
    service.restore(domain)
      .then(result => expect(result).toBe('successful'));
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainRestore(domain, 'WBP-00000'));
    expect(eppHelper.getEppMessageAndStatus).toHaveBeenCalledWith('the result');
  }));

  it('should submit a domain update status', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve('the result');
      }
    });
    eppHelper.getEppMessageAndStatus.and.returnValue('successful');
    const domain = 'StatusUpdateDomain';
    service.updateStatus(domain, ['car'], ['cheeseburger'])
      .then(result => expect(result).toBe('successful'));
    tick();
    expect(eppHelper.send).toHaveBeenCalledWith(domainStatusUpdate(domain, 'WBP-00000', ['car'], ['cheeseburger']));
    expect(eppHelper.getEppMessageAndStatus).toHaveBeenCalledWith('the result');
  }));

  it('should submit domain check and return correct result', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve(checkForAvailableDomainResponse);
      }
    });
    service.check('theCheckDomain.domian').then((result) => {
      expect(result.fullyQualifiedDomainName).toBe('available.domain');
      expect(result.avail).toBe(true);
      expect(result.reason).toBe('');
      expect(result.domainPrices.prices['create']).toBeDefined();
      expect(result.domainPrices.prices['renew']).toBeDefined();
      expect(result.domainPrices.prices['transfer']).toBeDefined();
      expect(result.domainPrices.prices['restore']).toBeDefined();
      expect(result.domainPrices.prices['restore'].fee['restore']).toBe('100.00');
      expect(result.domainPrices.prices['transfer'].fee['renew']).toBe('8.00');
    });
  }));

  it('should submit domain check and return correct result for premium name', fakeAsync(() => {
    eppHelper.send.and.returnValue({
      toPromise: () => {
        return Promise.resolve(checkForAvailablePremiumDomainResponse);
      }
    });
    service.check('theCheckDomain.domian').then((result) => {
      expect(result.fullyQualifiedDomainName).toBe('premium.domain');
      expect(result.avail).toBe(true);
      expect(result.reason).toBe('');
      expect(result.domainPrices.prices['create']).toBeDefined();
      expect(result.domainPrices.prices['renew']).toBeDefined();
      expect(result.domainPrices.prices['transfer']).toBeDefined();
      expect(result.domainPrices.prices['restore']).toBeDefined();
      expect(result.domainPrices.prices['restore'].fee['restore']).toBe('100.00');
      expect(result.domainPrices.prices['transfer'].fee['renew']).toBe('999.00');
      expect(result.domainPrices.prices['transfer'].feeClass).toBe('premium');
    });
  }));

  function createEppJsonResponse(data) {
    return {
      'epp': {
        'response': {
          'resData': data
        }
      }
    };
  }

});
