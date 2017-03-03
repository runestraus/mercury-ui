import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../service/search.service';
import { Domain } from '../model/domain.model';
import { Contact } from '../model/contact.model';
import { Host } from '../model/host.model';
import { CategorizedPremiumName } from '../model/categorized-premium-name.model';
import { ReservedName } from '../model/reserved-name.model';
import { DataResults } from '../model/data-results.model';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  domainResult: Domain[];
  hostResult: Host[];
  contactResult: Contact[];
  premiumNameResults: CategorizedPremiumName[];
  reservedNameResults: ReservedName[];
  dpmlResults: any;
  searchData: DataResults[];
  query: string;
  showError: boolean;
  searchType: string;
  displayItems: any[];

  constructor(private route: ActivatedRoute,
              private searchService: SearchService) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.route.params.switchMap(param => this.searchService.getSearchResults(param['query'])))
      .subscribe((searchResult) => {
        this.clearSearchData();
        this.searchData = searchResult.data;
        if (this.searchData !== undefined && this.searchData[0].dataList.length > 0) {
          this.showError = false;
          this.searchType = this.searchData[0].type;
          this.displayItems = [].concat(this.searchData[0].dataList);

          // Display result based upon search type
          switch (this.searchType) {
            case('!RSV'):
              this.reservedNameResults = this.displayItems;
              break;
            case('$'):
              this.premiumNameResults = this.displayItems;
              break;
            case('DOMAINS'):
              this.domainResult = this.displayItems;
              break;
            case('HOSTS'):
              this.hostResult = this.displayItems;
              break;
            case('CONTACTS'):
              this.contactResult = this.displayItems;
              break;
            case('!DPML'):
              this.dpmlResults = this.displayItems;
              break;
          }
        }
      });
  };

  clearSearchData() {
    this.domainResult = null;
    this.hostResult = null;
    this.contactResult = null;
    this.premiumNameResults = null;
    this.reservedNameResults = null;
    this.dpmlResults = null;
  }
}
