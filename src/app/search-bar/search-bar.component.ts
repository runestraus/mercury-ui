import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  query: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  newQuery() {
    this.router.navigate(['/search', this.query]);
  }

}
