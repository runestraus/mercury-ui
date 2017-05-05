import { DomainDetail } from '../../model/domain.model';
import { DomainEppService } from '../../service/domain-epp.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainLabelsService } from '../../service/domain.lables.service';
import { Money } from '../../model/money.model';

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
  labels: string[] = null;
  price: Money;
  createDomain = false;
  isPremium = false;
  separator = ' ';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domainEppService: DomainEppService,
    private domainLableService: DomainLabelsService) { }

  ngOnInit() {
    this.domainName = this.route.snapshot.params['domainName'];
    this.getDomain();
  }

  getDomain() {
    this.domainEppService.info(this.domainName, null).then(domainDetail => {
      this.loading = false;
      this.domainDetail = domainDetail;
      this.createDomain = false;
      this.getDomainLabels();
    }).catch(err => {
      this.loading = false;
      // switch these blocks of code to test out the partial domain info display
      if (err.code === '2303') {
        this.createDomain = true;
        this.getDomainLabels();
      } else if (err.code && err.message) {
        this.error = err.message;
      } else {
        this.error = 'There was an error getting domain info';
      }
    });
  }

  getDomainLabels() {
    this.domainLableService.getDomainLabels(this.domainName).then(res => {
      this.labels = res.labels;
      this.price = res.price;
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
