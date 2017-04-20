import { Component, OnInit, Input } from '@angular/core';
import { DomainDetail } from '../../../model/domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrarService } from '../../../service/registrar.service';
import { Registrar } from '../../../model/registrar.model';

@Component({
  selector: 'app-domain-info-status',
  templateUrl: './domain-info-status.component.html',
  styleUrls: ['./domain-info-status.component.css']
})
export class DomainInfoStatusComponent implements OnInit {
  @Input() domain: DomainDetail;
  registrar: Registrar;
  error: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private registrarService: RegistrarService) { }

  ngOnInit() {
    this.getRegistrar();
  }

  getRegistrar() {
   this.registrarService.get(this.domain.currentSponsorClientId)
     .then(reg => {
        this.registrar = reg;
      })
     .catch(err => {
       this.error = err.message;
     });
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

  getStatusTooltipMessage(): string {
    return this.checkStatus(['clientDeleteProhibited']) ? 'Server Status Prohibited' : 'Edit Domain Server Status';
  }

  openDomainTransferDialog(): void {
    alert('Not yet implemented');
  }

  openDomainRenewDialog(): void {
    this.router.navigate(['domainrenew'], {relativeTo: this.route});
  }

  openDomainRestoreDialog(): void {
    alert('Not yet implemented');
  }

  openDomainDeleteDialog(): void {
    this.router.navigate(['domaindelete'], {relativeTo: this.route});
  }

  openDomainServerStatusDialog(): void {
    this.router.navigate(['serverstatus'], {relativeTo: this.route});
  }
}
