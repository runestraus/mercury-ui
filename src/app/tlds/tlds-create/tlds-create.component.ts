import {Component} from '@angular/core';
import {Tld} from '../../model/tld.model';
import {Router} from '@angular/router';


@Component({
  selector: 'app-tlds-create',
  templateUrl: './tlds-create.component.html',
  styleUrls: ['./tlds-create.component.css']
})
export class TldsCreateComponent {
  closable = false;
  tld: Tld;

  constructor(private router: Router) {
    this.tld = new Tld();
  }

  onCancel() {
    this.router.navigate(['/tlds']);
  }

  onSubmit() {

  }
}
