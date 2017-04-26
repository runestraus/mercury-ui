import { DomainDetail } from '../../model/domain.model';
import { DomainEppService } from '../../service/domain-epp.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DpmlBlockService } from '../../service/dpml-block.service';
import {extractSld} from '../../shared/dpmlUtils';

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
  dpmlBlock: string = null;
  createDomain = false;
  isPremium = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domainEppService: DomainEppService,
    private dpmlBlockService: DpmlBlockService) { }

  ngOnInit() {
    this.domainName = this.route.snapshot.params['domainName'];
    this.getDomain();
  }

  getDomain() {
    this.domainEppService.info(this.domainName, null).then(domainDetail => {
      this.loading = false;
      this.domainDetail = domainDetail;
      if (domainDetail.domainPrices) {
        this.isPremium = DomainEppService.isPremium(domainDetail.domainPrices.prices['renew']);
      }
      this.createDomain = false;
      this.checkForDpmlBlock();
    }).catch(err => {
      this.loading = false;
      // switch these blocks of code to test out the partial domain info display
      if (err.code === '2303') {
        this.createDomain = true;
        this.checkForDpmlBlock();
      } else if (err.code && err.message) {
        this.error = err.message;
      } else {
        this.error = 'There was an error getting domain info';
      }
    });
  }

  checkForDpmlBlock() {
    this.dpmlBlockService.getDpmlBlock(extractSld(this.domainName)).then(res => {
        if (res.label !== null) {
        this.dpmlBlock = 'Blocked';
      }
    })
      .catch(err => {
        this.error = err;
      });
  }
  onCloseClicked() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }

  openDetailsDialog(): void {
    this.router.navigate(['details'], {relativeTo: this.route});
  }
}
