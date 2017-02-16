import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  result: any;
  query: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.query = this.route.snapshot.params['query'];
    // Use this for service call
    this.result = this.route.params
      .switchMap((params: Params) => {
      console.log(params);
      this.query = params['query'];
      console.log(this.query);
      return null;
    });
  }

}
