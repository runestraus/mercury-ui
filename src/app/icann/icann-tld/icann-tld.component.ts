import { Component, OnInit, Input } from '@angular/core';
import { IcannTld } from '../../model/icannTld.counter.model';
import { IcannService } from '../../service/icann.service';
import { Tld } from '../../model/tld.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-icann-tld',
  templateUrl: './icann-tld.component.html',
  styleUrls: ['./icann-tld.component.css']
})
export class IcannTldComponent implements OnInit {
  errorMessage: string;
  allTlds: Tld[];
  years: string[] = [];
  @Input() icannTld: IcannTld;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: IcannService) { }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i < currentYear + 10; i++) {
      this.years.push(i.toString());
    }
    this.icannTld = new IcannTld();
    this.icannTld.clientId = '';
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
    this.service.submitIcannTld(this.icannTld)
      .then(results => {
        this.errorMessage = null;
        this.icannTld = results;
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
