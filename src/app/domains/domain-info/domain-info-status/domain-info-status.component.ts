import { Component, OnInit, Input } from '@angular/core';

import { Domain, DomainDetail } from '../../../model/domain.model';

@Component({
  selector: 'app-domain-info-status',
  templateUrl: './domain-info-status.component.html',
  styleUrls: ['./domain-info-status.component.css']
})
export class DomainInfoStatusComponent implements OnInit {

  @Input() domain: DomainDetail;

  constructor() { }

  ngOnInit() {
  }

  checkStatus(statuses: Array<string>): boolean {
    for (const status of statuses) {
      if (this.domain.status.indexOf(status) > -1) {
        return true;
      }
    }
    return false;
  }

  getTransferTooltipMessage(): string {
    return this.checkStatus(['clientTransferProhibited']) ? 'Client Transfer Prohibited' : 'Transfer Domain';
  }

  getRenewTooltipMessage(): string {
    return this.checkStatus(['clientRenewProhibited']) ? 'Client Renew Prohibited' : 'Renew Domain';
  }

  getRestoreTooltipMessage(): string {
    return this.checkStatus(['clientRestoreProhibited']) ? 'Client Restore Prohibited' : 'Restore Domain';
  }

  getDeleteTooltipMessage(): string {
    return this.checkStatus(['clientDeleteProhibited']) ? 'Client Delete Prohibited' : 'Delete Domain';
  }

  openDomainTransferDialog(): void {
    alert('Not yet implemented');
  }

  openDomainRenewDialog(): void {
    alert('Not yet implemented');
  }

  openDomainRestoreDialog(): void {
    alert('Not yet implemented');
  }

  openDomainDeleteDialog(): void {
    alert('Not yet implemented');
  }

  openDomainServerStatusDialog(): void {
    alert('Not yet implemented');
  }

  openDomainStatusDialog(): void {
    alert('Not yet implemented');
  }

}