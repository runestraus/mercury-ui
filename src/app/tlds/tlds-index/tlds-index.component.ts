import {Component, OnInit} from "@angular/core";
import {TldService} from "../../service/tld.service";
import {Tld} from "../../model/tld.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tlds-index',
  templateUrl: './tlds-index.component.html',
  styleUrls: ['./tlds-index.component.css']
})
export class TldsIndexComponent implements OnInit {
  tldList: Tld[];
  errorMsg: string;

  constructor(private tldService: TldService,
              private router: Router) {}

  ngOnInit() {
    this.tldList = this.tldService.getTlds();
  }

  createNewTld() {
    this.router.navigate(['/tlds/new']);
  }


}
