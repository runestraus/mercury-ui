import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Domain, DomainDetail } from '../../model/domain.model';
import { getParentRouteUrl } from '../../shared/routeutils';
import { DomainEppService } from '../../service/domain-epp.service';

@Component({
  selector: 'app-domain-info-detail',
  templateUrl: './domain-info-detail.component.html',
  styleUrls: ['./domain-info-detail.component.css']
})
export class DomainInfoDetailComponent implements OnInit {
  domainName: string;
  domainDetail: DomainDetail;
  showDialog = true;
  loading = true;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domainEppService: DomainEppService) { }

  ngOnInit() {
    this.domainName = this.route.parent.snapshot.params['domainName'];
    this.getDomain();
  }

  getDomain() {
    this.domainEppService.info(this.domainName, null).then(domainDetail => {
      this.loading = false;
      this.domainDetail = domainDetail;
    }).catch(err => {
      this.loading = false;
      if (err.code && err.message) {
        this.error = err.message;
      } else {
        this.error = 'There was an error getting domain info';
      }
    });
  }

  onCloseClicked() {
    // Navigate to parent route
    this.router.navigate([getParentRouteUrl(this.route)]);
  }
}
