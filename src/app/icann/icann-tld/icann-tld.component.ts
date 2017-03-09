import { Component, OnInit, Input } from '@angular/core';
import { IcannTld } from '../../model/icannTld.counter.model';
import { IcannService } from '../../service/icann.service';
import { Tld } from '../../model/tld.model';

@Component({
  selector: 'app-icann-tld',
  templateUrl: './icann-tld.component.html',
  styleUrls: ['./icann-tld.component.css']
})
export class IcannTldComponent implements OnInit {
  errorMessage: string;
  allTlds: Tld[];
  @Input() icannTld: IcannTld;
  constructor(private service: IcannService) { }

  ngOnInit() {
    this.icannTld = new IcannTld();
    this.icannTld.transferDisputedWonCount = 0;
    this.icannTld.transferDisputedLostCount = 0;
    this.icannTld.agpExemptedDomainsCount = 0;
    this.icannTld.agpExemptionRequestsCount = 0;
    this.icannTld.agpExemptionsGrantedCount = 0;
    this.icannTld.transferDisputedNondecisionCount = 0;

    this.service.getAllTlds()
      .then( results => this.allTlds = results)
      .catch(error => this.errorMessage = error);
  };

  submit() {
    this.icannTld.month = this.icannTld.date.getMonth() + 1;
    this.icannTld.year  = this.icannTld.date.getFullYear();
    delete this.icannTld.date;
    this.service.submitIcannTld(this.icannTld)
      .then(results => this.icannTld = results)
      .catch(error => {
        this.errorMessage = error;
      });
  }
}
