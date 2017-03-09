import { Component, OnInit, Input } from '@angular/core';
import { IcannDns } from '../../model/icannDns.counter.model';
import { IcannService } from '../../service/icann.service';
import { Tld } from '../../model/tld.model';

@Component({
  selector: 'app-icann-dns',
  templateUrl: './icann-dns.component.html',
  styleUrls: ['./icann-dns.component.css']
})
export class IcannDnsComponent implements OnInit {
  errorMessage: string;
  allTlds: Tld[];

  @Input() icannDns: IcannDns;

  constructor(private service: IcannService) { }

  ngOnInit() {
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
    this.icannDns.month = this.icannDns.date.getMonth() + 1;
    this.icannDns.year = this.icannDns.date.getFullYear();
    delete this.icannDns.date;
    this.service.submitIcannDns(this.icannDns)
      .then()
      .catch(error => {
        this.errorMessage = error;
      });
  }
}
