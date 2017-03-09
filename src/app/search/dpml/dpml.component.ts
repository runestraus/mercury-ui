import { Component, OnInit, Input } from '@angular/core';
import { Dpml } from '../../model/dpml.model';
import { Domain } from '../../model/domain.model';
import { CategorizedPremiumName } from '../../model/categorized-premium-name.model';
import { ReservedName } from '../../model/reserved-name.model';


@Component({
  selector: 'app-dpml',
  templateUrl: './dpml.component.html',
  styleUrls: ['./dpml.component.css']
})
export class DpmlComponent implements OnInit {
  errorMessage: string;
  @Input() dpmls: Dpml[];
  @Input() domains: Domain[];
  @Input() premiumNames: CategorizedPremiumName[];
  @Input() reservedNames: ReservedName[];
  constructor() {}

  ngOnInit() {
  }

}
