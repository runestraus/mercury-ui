import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {SearchService} from '../service/search.service';
import {Domain} from '../model/domain.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  result: Domain[];
  query: string;

  constructor(private route: ActivatedRoute,
              private searchService: SearchService) { }

  ngOnInit() {
    this.query = this.route.snapshot.params['query'];
    this.result = this.searchService.getDomains(this.query);
    // Use this for service call
    // this.result = this.route.params
    //   .switchMap((params: Params) => {
    //   console.log(params);
    //   this.query = params['query'];
    //   console.log(this.query);
    //   return null;
    // });
  }

}
