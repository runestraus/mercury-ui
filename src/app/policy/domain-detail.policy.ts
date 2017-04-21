import { User } from '../model/user.model';
import { DomainDetail } from '../model/domain.model';

export class DomainDetailPolicy {

  static renew(detail: DomainDetail, user: User): string {
    if (detail.currentSponsorClientId !== user.clientId) {
      return 'Current user\'s Registrar is not the sponsoring registrar';
    }
    const invalidStatus = detail.status.filter(status => {
      const invalidStatuses = ['pendingDelete',
        'pendingRenew', 'pendingRestore', 'pendingTransfer', 'pendingUpdate',
        'serverRenewProhibited', 'transferPeriod', 'clientRenewProhibited'];
      return invalidStatuses.indexOf(status) > -1;
    });
    if (invalidStatus.length === 1) {
      return `Status can not be '${invalidStatus[0]}'`;
    } else if (invalidStatus.length !== 0) {
      return `Status can not be any of '${invalidStatus.join(', ')}'`;
    }
    return null;
  }

}
