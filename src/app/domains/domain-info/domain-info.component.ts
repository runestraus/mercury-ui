import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainDetail } from '../../model/domain.model';
import { DomainEppService } from '../../service/domain-epp.service';
import { getParentRouteUrl } from '../../shared/routeutils';

@Component({
  selector: 'app-domain-info',
  templateUrl: './domain-info.component.html',
  styleUrls: ['./domain-info.component.css']
})
export class DomainInfoComponent implements OnInit {

  domainName: string;
  domainDetail: DomainDetail;
  showDialog = true;
  loading = true;
  error: string = null;
  createDomain = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domainEppService: DomainEppService) { }

  ngOnInit() {
    this.domainName = this.route.snapshot.params['domainName'];
    this.getDomain();
  }

  getDomain() {
    this.domainEppService.info(this.domainName, null).then(domainDetail => {
      this.loading = false;
      this.domainDetail = domainDetail;
      this.createDomain = false;
    }).catch(err => {
      this.loading = false;
      // switch these blocks of code to test out the partial domain info display
      if (err.code === '2303') {
        this.createDomain = true;
      } else if (err.code && err.message) {
        this.error = err.message;
      } else {
        console.error(err);
        this.error = 'There was an error getting domain info';
      }
    });
  }

  onCloseClicked() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }

  openDetailsDialog(): void {
    this.router.navigate(['details'], {relativeTo: this.route});
  }
}
