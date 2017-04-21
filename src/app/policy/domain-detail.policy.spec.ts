
import { DomainDetailPolicy } from './domain-detail.policy';
import { DomainDetail } from '../model/domain.model';
import { User } from '../model/user.model';
describe('DomainDetailPolicy', () => {
  it('should return error message when user is not the sponsoring registrar', () => {
    const detail = { currentSponsorClientId: 'notValid', fullyQualifiedDomainName: 'dev.dev' } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.renew(detail, user)).toBe('Current user\'s Registrar is not the sponsoring registrar');
  });

  function checkStatus(status: string) {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: [status] } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.renew(detail, user)).toBe(`Status can not be '${status}'`);
  }

  it('should return an error message when the domain has an invalid status', () => {
    const invalidStatuses = ['pendingDelete',
      'pendingRenew', 'pendingRestore', 'pendingTransfer', 'pendingUpdate',
      'serverRenewProhibited', 'transferPeriod', 'clientRenewProhibited'];

    invalidStatuses.forEach(status => {
      checkStatus(status);
    });
  });

  it('should renew list all statuses in error message', () => {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: ['pendingTransfer', 'pendingRenew', 'pendingRestore'] } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.renew(detail, user))
      .toBe(`Status can not be any of 'pendingTransfer, pendingRenew, pendingRestore'`);
  });

  it('should return null when the user can renew the domain', () => {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: [] } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.renew(detail, user)).toBeNull();
  });
});
