import { Component, OnInit, Input } from '@angular/core';
import { DomainDetail } from '../../../model/domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrarService } from '../../../service/registrar.service';
import { Registrar } from '../../../model/registrar.model';
import { PermissionService } from '../../../service/permission.service';
import { DomainDetailPolicy } from '../../../policy/domain-detail.policy';

@Component({
  selector: 'app-domain-info-status',
  templateUrl: './domain-info-status.component.html',
  styleUrls: ['./domain-info-status.component.css']
})
export class DomainInfoStatusComponent implements OnInit {
  @Input() domain: DomainDetail;
  registrar: Registrar;
  error: string;
  canRenew = false;
  canRestore = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private registrarService: RegistrarService,
              private permissionService: PermissionService) { }

  ngOnInit() {
    this.getRegistrar();
    this.setPermissions();
  }

  setPermissions() {
    this.permissionService.authorize(DomainDetailPolicy.renew, this.domain)
      .then(res => {
        this.canRenew = res.authorized;
      })
      .catch(() => {
        this.error = 'Error obtaining permissions.';
      });

      this.permissionService.authorize(DomainDetailPolicy.restore, this.domain)
      .then(res => {
        this.canRestore = res.authorized;
      })
      .catch(() => {
        this.error = 'Error obtaining permissions.';
      });
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
    if (this.canRenew) {
      this.router.navigate(['domainrenew'], { relativeTo: this.route });
    }
  }

  openDomainRestoreDialog(): void {
    if (this.canRestore) {
      this.router.navigate(['restore'], {relativeTo: this.route});
    }
  }

  openDomainDeleteDialog(): void {
    this.router.navigate(['domaindelete'], {relativeTo: this.route});
  }

  openDomainServerStatusDialog(): void {
    this.router.navigate(['serverstatus'], {relativeTo: this.route});
  }
}
