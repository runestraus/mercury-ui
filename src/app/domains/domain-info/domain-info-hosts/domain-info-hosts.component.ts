import { Component, OnInit, Input } from '@angular/core';

import { DomainDetail } from '../../../model/domain.model';

@Component({
  selector: 'app-domain-info-hosts',
  templateUrl: './domain-info-hosts.component.html',
  styleUrls: ['./domain-info-hosts.component.css']
})
export class DomainInfoHostsComponent implements OnInit {

  @Input() domain: DomainDetail;

  constructor() { }

  ngOnInit() {
  }

  onEditHost(nameserver: string): void {
    alert('Not yet implemented');
  }

  onShowAllNameservers(nameservers: Array<string>): void {
    alert('Not yet implemented');
  }

  openEditHostsDialog(): void {
    alert('Not yet implemented');
  }
}
