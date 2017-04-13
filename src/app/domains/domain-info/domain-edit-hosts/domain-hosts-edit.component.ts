import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DomainEppService } from '../../../service/domain-epp.service';
import { DomainDetail } from '../../../model/domain.model';
import { DomainUpdateInfo } from '../../../epp/domainepp.template';
import { EppMessageAndStatus } from '../../../epp/epphelper.service';
import { getParentRouteUrl } from '../../../shared/routeutils';

@Component({
  selector: 'app-domain-hosts-edit',
  templateUrl: './domain-hosts-edit.component.html',
  styleUrls: ['./domain-hosts-edit.component.css']
})
export class DomainHostsEditComponent implements OnInit {
  domainDetail: DomainDetail;
  showDialog: boolean;
  domainName: string;
  domainHostsForm: FormGroup;
  errors: string[];
  error: string;
  loading = true;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private domainEppService: DomainEppService) { }

  ngOnInit() {
    this.domainName = this.route.snapshot.params['domainName'];
    this.getDomain();
    this.createForm();
    this.showDialog = true;
  }

  getNameservers(domainHostsForm) {
    return domainHostsForm.get('nameservers').controls;
  }

  getDomain() {
    this.domainEppService.info(this.domainName, null).then(domainDetail => {
      this.loading = false;
      this.domainDetail = domainDetail;
      const hosts = domainDetail.nameservers;
      this.removeNameserverInput(0);
      const control = <FormArray>this.domainHostsForm.controls['nameservers'];
      for (const host of hosts) {
        control.push(this.initHosts(host));
      }
    }).catch(err => {
      this.loading = false;
      if (err.code && err.message) {
        this.error = err.message;
      } else {
        console.error(err);
        this.error = 'There was an error getting domain info';
      }
    });
  };

  createForm() {
    this.domainHostsForm = this.fb.group({
      nameservers: this.fb.array([
        this.initHosts()
      ])
    });
  }

  initHosts(host?: string): FormGroup {
    const ns = this.fb.group;
    return this.fb.group({
      nameserver: [host, Validators.required]
    });
  }

  addNameserverInput() {
    const control = <FormArray>this.domainHostsForm.controls['nameservers'];
    control.push(this.initHosts());
  }

  removeNameserverInput(i) {
    const control = <FormArray>this.domainHostsForm.controls['nameservers'];
    control.removeAt(i);
  }

  /** Returns the hosts that are present in host1 but missing in host2 */
  getMissingHosts(host1: Array<string>, host2: Array<string>): Array<string> {
    // Use lookup object to avoid n squared comparisons
    const lookup = host2.reduce((result, host) => { result[host] = true; return result; }, {});
    const result: Array<string> = [];
    for (const host of host1) {
      if (!lookup[host]) {
        result.push(host);
      }
    }
    return result;
  }

  prepareHostsForSave() {
    const nameservers: Array<string> = [];
    for (const nameserver of this.domainHostsForm.value.nameservers) {
      nameservers.push(nameserver.nameserver);
    }
    return {
      fullyQualifiedDomainName: this.domainName,
      nameservers: nameservers
    };
  }

  onSubmit() {
    const hostEdited = this.prepareHostsForSave();
    const domainNameservers = hostEdited.nameservers.filter(
      host => host.length > 0);
    const addDomainnHosts = this.getMissingHosts(domainNameservers, this.domainDetail.nameservers);
    const remDomainHosts = this.getMissingHosts(this.domainDetail.nameservers, domainNameservers);
    const domainUpdateInfo: DomainUpdateInfo = {
      addHosts: addDomainnHosts,
      remHosts: remDomainHosts
    };
    this.domainEppService.update(this.domainName, domainUpdateInfo).then(domainDetal => {
      this.loading = false;
      this.showDialog = false;
      this.router.navigate(['..'], {relativeTo: this.route});
    }).catch(err => {
      this.error = err.message;
    });
  }

  closeDialog() {
    this.showDialog = false;
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  onCloseClicked() {
    this.closeDialog();
  }
}
