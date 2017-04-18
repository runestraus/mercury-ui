import { Component, OnInit, Input } from '@angular/core';
import { IcannDns } from '../../model/icannDns.counter.model';
import { IcannService } from '../../service/icann.service';
import { Tld } from '../../model/tld.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-icann-dns',
  templateUrl: './icann-dns.component.html',
  styleUrls: ['./icann-dns.component.css']
})
export class IcannDnsComponent implements OnInit {
  errorMessage: string;
  allTlds: Tld[];
  years: string[] = [];
  @Input() icannDns: IcannDns;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: IcannService) { }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i < currentYear + 10; i++) {
      this.years.push(i.toString());
    }
    this.icannDns = new IcannDns();
    this.icannDns.dnsTcpQueriesReceivedCount = 0;
    this.icannDns.dnsTcpQueriesRespondedCount = 0;
    this.icannDns.dnsUdpQueriesRespondedCount = 0;
    this.icannDns.dnsUdpQueriesReceivedCount = 0;

    this.service.getAllTlds()
      .then( results => this.allTlds = results)
      .catch(error => this.errorMessage = error);
  }

  submit() {
    this.service.submitIcannDns(this.icannDns)
      .then(results => {
        this.icannDns = results;
      })
      .catch(error => {
        this.errorMessage = this.extractErrorMessage(error);
      });
  }

  extractErrorMessage(error): string {
    return error.substring(error.indexOf(':') + 1);
  }

  onCancel() {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
