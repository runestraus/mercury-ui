
import { DomainDetailPolicy } from './domain-detail.policy';
import { DomainDetail } from '../model/domain.model';
import { User } from '../model/user.model';
describe('DomainDetailPolicy', () => {
  it('should return error message when user is not the sponsoring registrar', () => {
    const detail = { currentSponsorClientId: 'notValid', fullyQualifiedDomainName: 'dev.dev' } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.renew(detail, user)).toBe('Current user\'s Registrar is not the sponsoring registrar');
    expect(DomainDetailPolicy.restore(detail, user)).toBe('Current user\'s Registrar is not the sponsoring registrar');
  });

  function checkStatus(status: string) {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: [status]
    } as DomainDetail;
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
      status: ['pendingTransfer', 'pendingRenew', 'pendingRestore']
    } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.renew(detail, user))
      .toBe(`Status can not be any of 'pendingTransfer, pendingRenew, pendingRestore'`);
  });

  it('should return null when the user can renew the domain', () => {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: []
    } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.renew(detail, user)).toBeNull();
  });

  it('should delete list all statuses in error message', () => {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: ['pendingTransfer', 'pendingRenew', 'pendingRestore']
    } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.delete(detail, user))
      .toBe(`Status can not be any of 'pendingTransfer, pendingRenew, pendingRestore'`);
  });

  it('should return null when the user can delete the domain', () => {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: []
    } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.delete(detail, user)).toBeNull();
  });

  it('should return "Status can only be `pendingDelete`" when the user can not restore the domain', () => {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: ['ok'] } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.restore(detail, user)).toBe(`Status can only be 'pendingDelete'`);
  });

  it('should return null when the user can restore the domain', () => {
    const detail = {
      currentSponsorClientId: 'theUsers',
      fullyQualifiedDomainName: 'dev.dev',
      status: ['pendingDelete'] } as DomainDetail;
    const user = { clientId: 'theUsers' } as User;

    expect(DomainDetailPolicy.restore(detail, user)).toBeNull();
  });
});

  describe('updateServerStatus', () => {
    it('should return null when the user is a registry admin', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'theUsers', role: {name: 'REGISTRY_ADMIN'} } as User;
      expect(DomainDetailPolicy.updateServerStatus(detail, user)).toBeNull();
    });

    it('should return null when the user is a registry operator', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'theUsers', role: {name: 'REGISTRY_USER'} } as User;
      expect(DomainDetailPolicy.updateServerStatus(detail, user)).toBeNull();
    });

    it('should return an error when the user is a not registry operator or registry admin', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'theUsers', role: {name: 'INVALID_ROLE'} } as User;
      expect(DomainDetailPolicy.updateServerStatus(detail, user))
        .toBe(`User with role: 'INVALID_ROLE' is not allowed to update server status`);
    });
  });

  describe('updateClientStatus', () => {
    it('should return null when user is a registry admin', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'theUsers', role: {name: 'REGISTRY_ADMIN'} } as User;
      expect(DomainDetailPolicy.updateClientStatus(detail, user)).toBeNull();
    });

    it('should return null when user is a registry user', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'theUsers', role: {name: 'REGISTRY_USER'} } as User;
      expect(DomainDetailPolicy.updateClientStatus(detail, user)).toBeNull();
    });

    it('should return null when user is a registrar user', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'theUsers', role: {name: 'REGISTRAR_USER'} } as User;
      expect(DomainDetailPolicy.updateClientStatus(detail, user)).toBeNull();
    });

    it('should return null when user is a registrar admin', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'theUsers', role: {name: 'REGISTRAR_ADMIN'} } as User;
      expect(DomainDetailPolicy.updateClientStatus(detail, user)).toBeNull();
    });

    it('should return an error when user is not valid', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'theUsers', role: {name: 'INVALID_ROLE'} } as User;
      expect(DomainDetailPolicy.updateClientStatus(detail, user))
        .toBe(`User with role: 'INVALID_ROLE' is not allowed to update client status`);
    });

    it('should return an error when the users registrar is not the current sponsoring registrar', () => {
      const detail = {
        currentSponsorClientId: 'theUsers',
        fullyQualifiedDomainName: 'dev.dev',
        status: [] } as DomainDetail;
      const user = { clientId: 'notTheSponsor', role: {name: 'REGISTRAR_ADMIN'} } as User;
      expect(DomainDetailPolicy.updateClientStatus(detail, user)).toBe('Current user\'s Registrar is not the sponsoring registrar');
    });
});
