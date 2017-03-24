import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainDetail } from '../../model/domain.model';
import { DomainEppService } from '../../service/domain-epp.service';

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
    if (!this.domainName) {
      this.domainName = this.route.parent.snapshot.params['domainName'];
    }
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
    // Navigate to parent route
    // this works even when the parent isn't in the browser history
    this.route.parent.url.map(
      segments => '/' + segments.join('/'))
    .forEach(
      url => this.router.navigate([url]));
  }

  openDetailsDialog(): void {
    alert('Not yet implemented');
  }
}
