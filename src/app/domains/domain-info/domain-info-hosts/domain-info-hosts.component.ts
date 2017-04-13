import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DomainDetail } from '../../../model/domain.model';

@Component({
  selector: 'app-domain-info-hosts',
  templateUrl: './domain-info-hosts.component.html',
  styleUrls: ['./domain-info-hosts.component.css']
})
export class DomainInfoHostsComponent implements OnInit {

  @Input() domain: DomainDetail;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {}

  onEditHost(nameserver: string): void {
    this.router.navigate(['hosts/' + nameserver], {relativeTo: this.route});
  }

  onShowAllNameservers(nameservers: Array<string>): void {
    alert('Not yet implemented');
  }

  openEditHostsDialog(): void {
    this.router.navigate(['hostsedit'], {relativeTo: this.route});
  }
}
