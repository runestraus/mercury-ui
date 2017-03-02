import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../service/search.service';
import { Domain } from '../model/domain.model';
import { SearchResults } from '../model/search-results.model';
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

  searchResult: Promise<SearchResults>;
  dataResults: DataResults[];
  domainResult: Domain[];
  hostResult: Host[];
  contactResult: Contact[];
  premiumNameResults: CategorizedPremiumName[];
  reservedNameResults: ReservedName[];
  dpmlResults: any;
  query: string;
  searchData: any;
  showError: boolean;
  showlist: boolean;
  searchType: string;
  displayItems: any[];

  constructor(private route: ActivatedRoute,
              private searchService: SearchService) { }

  ngOnInit() {
    this.query = this.route.snapshot.params['query'];
    this.searchResult = this.searchService.getSearchResults(this.query);
    this.searchResult.then(searchResult => {
      this.searchData = searchResult.data;
      this.dataResults = searchResult.data;
      if (this.searchData !== undefined && this.searchData[0].dataList.length > 0) {
        this.showError = false;
        this.searchType = this.searchData[0].type;
        this.showlist = true;
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
    }).catch(error => this.handleError(error));

    // Use this for service call
    // this.result = this.route.params
    //   .switchMap((params: Params) => {
    //   console.log(params);
    //   this.query = params['query'];
    //   console.log(this.query);
    //   return null;
    // });
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
